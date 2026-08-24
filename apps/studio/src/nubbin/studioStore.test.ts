import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { home } from "demo/fixtures/home";
import { afterEach, expect, test } from "vitest";
import { compileVersion } from "./compileVersion";
import { studioStore } from "./studioStore";

afterEach(() => {
  delete process.env.NUBBIN_STUDIO_STORE;
});

test("writes land under the directory the environment names, read at call time", async () => {
  const root = mkdtempSync(join(tmpdir(), "nubbin-store-"));
  process.env.NUBBIN_STUDIO_STORE = root;
  const artifact = compileVersion(home, "/");
  await studioStore().write(artifact);
  expect(existsSync(join(root, "artifacts", `${artifact.hash}.json`))).toBe(true);
});
