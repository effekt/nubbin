import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Artifact, ArtifactStore, RoutePointer } from "@nubbin/core";
import { beforeEach, expect, test } from "vitest";
import { publishDraft } from "./publishDraft";

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

/** In-memory implementation of the store interface, with the same publish precondition the
 * fs adapter enforces: a pointer may only name a written hash. */
function memoryStore(): ArtifactStore {
  const artifacts = new Map<string, Artifact>();
  const pointers = new Map<string, RoutePointer>();
  return {
    read: (hash) => Promise.resolve(artifacts.get(hash) ?? null),
    write: (artifact) => {
      artifacts.set(artifact.hash, artifact);
      return Promise.resolve();
    },
    manifest: () =>
      Promise.resolve({ routes: [...pointers.values()], generatedAt: new Date().toISOString() }),
    pointer: (route) => Promise.resolve(pointers.get(route) ?? null),
    publish: (route, hash) => {
      if (!artifacts.has(hash)) {
        return Promise.reject(new Error(`unwritten hash ${hash}`));
      }
      pointers.set(route, { route, matchKind: "exact", hash, updatedAt: new Date().toISOString() });
      return Promise.resolve();
    },
    unpublish: (route) => {
      pointers.delete(route);
      return Promise.resolve();
    },
  };
}

test("publishing writes the artifact, then moves the pointer through the given mover", async () => {
  const store = memoryStore();
  const moved: Array<{ route: string; hash: string }> = [];
  const hash = await publishDraft(store, "/", async (route, pointedAt) => {
    // The consumer's handler runs against the same store the studio wrote into.
    await store.publish(route, pointedAt);
    moved.push({ route, hash: pointedAt });
  });
  expect(hash).toBeDefined();
  expect(moved).toEqual([{ route: "/", hash }]);
  const artifact = hash === undefined ? null : await store.read(hash);
  expect(artifact?.route).toBe("/");
});

test("a route with no draft publishes nothing and moves no pointer", async () => {
  const store = memoryStore();
  const moved: string[] = [];
  const hash = await publishDraft(store, "/no-such-route", (route) => {
    moved.push(route);
    return Promise.resolve();
  });
  expect(hash).toBeUndefined();
  expect(moved).toEqual([]);
});

test("a refused pointer move fails the publish, with the artifact already written", async () => {
  const store = memoryStore();
  let written: string | undefined;
  const attempt = publishDraft(store, "/", (_route, hash) => {
    written = hash;
    return Promise.reject(new Error("the application is not running"));
  });
  await expect(attempt).rejects.toThrow("not running");
  const artifact = written === undefined ? null : await store.read(written);
  expect(artifact?.route).toBe("/");
});
