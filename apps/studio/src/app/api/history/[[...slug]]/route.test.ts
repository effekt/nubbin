import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFsArtifactStore } from "@nubbin/store-fs";
import type { HistoryReply } from "@nubbin/studio";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { compileVersion } from "../../../../nubbin/compileVersion";
import { GET } from "./route";

function get(slug?: string[]) {
  return GET(new Request("http://studio.test/api/history"), {
    params: Promise.resolve(slug === undefined ? {} : { slug }),
  });
}

let storeRoot: string;

beforeEach(() => {
  storeRoot = mkdtempSync(join(tmpdir(), "nubbin-store-"));
  process.env.NUBBIN_STUDIO_STORE = storeRoot;
});

// Real moves, not fixtures of them: two artifacts published into the store the endpoint
// reads, exactly as the demo's own publishes land there.
async function publishTwice() {
  const store = createFsArtifactStore(storeRoot);
  const first = compileVersion(home, "/");
  await store.write(first);
  await store.publish("/", first.hash);
  const changed = structuredClone(home);
  changed.meta = { ...changed.meta, title: "Second words" };
  const second = compileVersion(changed, "/");
  await store.write(second);
  await store.publish("/", second.hash);
  return { first, second };
}

test("a published route answers its pointer's hash and both moves, newest first", async () => {
  const { first, second } = await publishTwice();
  const response = await get();
  expect(response.status).toBe(200);
  const payload = (await response.json()) as HistoryReply;
  expect(payload.current).toBe(second.hash);
  expect(payload.moves?.map((move) => move.hash)).toEqual([second.hash, first.hash]);
  expect(payload.total).toBe(2);
});

test("a route never published answers empty history, not a throw", async () => {
  const response = await get(["nowhere"]);
  expect(await response.json()).toEqual({ current: null, moves: [], total: 0 });
});
