import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { findConfigFile } from "./findConfigFile";

/** A repository root — a directory carrying `.git`, which is where the search stops. */
const freshRepo = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), "nubbin-cli-"));
  await mkdir(join(root, ".git"));
  return root;
};

describe("findConfigFile", () => {
  test("finds the config in the directory it starts from", async () => {
    const root = await freshRepo();
    await writeFile(join(root, "nubbin.config.ts"), "");
    expect(await findConfigFile(root)).toBe(join(root, "nubbin.config.ts"));
  });

  test("walks up to find a config beside the application it was run from", async () => {
    const root = await freshRepo();
    const app = join(root, "apps", "web");
    await mkdir(app, { recursive: true });
    await writeFile(join(root, "nubbin.config.ts"), "");
    expect(await findConfigFile(app)).toBe(join(root, "nubbin.config.ts"));
  });

  test("the nearer config wins, so an application overrides the repository's", async () => {
    const root = await freshRepo();
    const app = join(root, "apps", "web");
    await mkdir(app, { recursive: true });
    await writeFile(join(root, "nubbin.config.ts"), "");
    await writeFile(join(app, "nubbin.config.ts"), "");
    expect(await findConfigFile(app)).toBe(join(app, "nubbin.config.ts"));
  });

  test("takes the TypeScript config over the JavaScript one in the same directory", async () => {
    const root = await freshRepo();
    await writeFile(join(root, "nubbin.config.js"), "");
    await writeFile(join(root, "nubbin.config.ts"), "");
    expect(await findConfigFile(root)).toBe(join(root, "nubbin.config.ts"));
  });

  test("finds a JavaScript config where there is no TypeScript one", async () => {
    const root = await freshRepo();
    await writeFile(join(root, "nubbin.config.js"), "");
    expect(await findConfigFile(root)).toBe(join(root, "nubbin.config.js"));
  });

  test("stops at the repository root rather than reaching a config outside it", async () => {
    const outer = await mkdtemp(join(tmpdir(), "nubbin-cli-outer-"));
    await writeFile(join(outer, "nubbin.config.ts"), "");
    const root = join(outer, "repo");
    await mkdir(join(root, ".git"), { recursive: true });
    expect(await findConfigFile(root)).toBeNull();
  });

  test("returns null when there is no config anywhere above", async () => {
    expect(await findConfigFile(await freshRepo())).toBeNull();
  });

  test("with no repository around it, still finds the config beside the command", async () => {
    const bare = await mkdtemp(join(tmpdir(), "nubbin-cli-bare-"));
    await writeFile(join(bare, "nubbin.config.ts"), "");
    expect(await findConfigFile(bare)).toBe(join(bare, "nubbin.config.ts"));
  });

  test("with no repository around it, does not climb — a config above could belong to anything", async () => {
    const outer = await mkdtemp(join(tmpdir(), "nubbin-cli-bare-"));
    await writeFile(join(outer, "nubbin.config.ts"), "");
    const inner = join(outer, "apps", "web");
    await mkdir(inner, { recursive: true });
    expect(await findConfigFile(inner)).toBeNull();
  });
});
