import { mkdtemp, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { createFsArtifactStore } from "./createFsArtifactStore";
import { artifactFixture } from "./testing/artifactFixture";
import { runArtifactStoreContract } from "./testing/runArtifactStoreContract";

const freshRoot = () => mkdtemp(join(tmpdir(), "nubbin-store-"));

runArtifactStoreContract("fs", async () => createFsArtifactStore(await freshRoot()));

describe("fs-specific behaviour", () => {
  test("each pointer is its own file and no aggregate manifest document exists", async () => {
    const root = await freshRoot();
    const store = createFsArtifactStore(root);
    await store.write(artifactFixture("a1", "/x"));
    await store.write(artifactFixture("a2", "/y"));
    await store.publish("/x", "a1");
    await store.publish("/y", "a2");
    const entries = await readdir(join(root, "routes"));
    expect(entries.sort()).toEqual(["%2Fx.json", "%2Fy.json"]);
    expect(await readdir(root)).not.toContain("manifest.json");
  });

  // The pointer moves first and the log is appended after: a failure between the two must
  // leave the log short, never claiming a publish that went nowhere. Making `routes` a plain
  // file forces the pointer write itself to fail, so anything the log then holds is a lie.
  test("a publish whose pointer write failed records no move", async () => {
    const root = await freshRoot();
    const store = createFsArtifactStore(root);
    await store.write(artifactFixture("a1", "/x"));
    await writeFile(join(root, "routes"), "not a directory");
    await expect(store.publish("/x", "a1")).rejects.toThrow();
    expect(await store.history?.("/x")).toEqual([]);
  });

  test("a second store over the same root sees everything the first wrote", async () => {
    const root = await freshRoot();
    const first = createFsArtifactStore(root);
    await first.write(artifactFixture("a1", "/x"));
    await first.publish("/x", "a1");
    const second = createFsArtifactStore(root);
    expect((await second.pointer("/x"))?.hash).toBe("a1");
  });
});
