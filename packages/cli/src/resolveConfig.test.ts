import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { resolveConfig } from "./resolveConfig";

const CONFIG = `export default {
  catalog: {}, registry: {}, store: {}, document: (route) => ({ route }),
};`;

const projectAt = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), "nubbin-cli-resolve-"));
  await mkdir(join(root, ".git"));
  await writeFile(join(root, "nubbin.config.ts"), CONFIG);
  return root;
};

describe("resolveConfig", () => {
  test("finds and loads the config above where the command was run", async () => {
    const root = await projectAt();
    const app = join(root, "apps", "web");
    await mkdir(app, { recursive: true });
    expect(await resolveConfig(app)).toHaveProperty("document");
  });

  test("loads the config it was pointed at, relative to where the command was run", async () => {
    const root = await projectAt();
    expect(await resolveConfig(root, "nubbin.config.ts")).toHaveProperty("document");
  });

  test("says what it looked for when there is no config to find", async () => {
    const bare = await mkdtemp(join(tmpdir(), "nubbin-cli-bare-"));
    await mkdir(join(bare, ".git"));
    await expect(resolveConfig(bare)).rejects.toThrow(/nubbin\.config\.ts/);
  });

  test("outside any repository, says the search went no further and points at --config", async () => {
    const bare = await mkdtemp(join(tmpdir(), "nubbin-cli-bare-"));
    await expect(resolveConfig(bare)).rejects.toThrow(/--config/);
  });

  test("does not search when it was given a path that is not there", async () => {
    const root = await projectAt();
    await expect(resolveConfig(root, "apps/web/nubbin.config.ts")).rejects.toThrow(
      /apps\/web\/nubbin\.config\.ts/,
    );
  });
});
