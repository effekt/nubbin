import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { existingConfigIn } from "./existingConfigIn";

const directory = (): Promise<string> => mkdtemp(join(tmpdir(), "nubbin-cli-existing-"));

describe("existingConfigIn", () => {
  test("an empty directory holds no config", async () => {
    expect(await existingConfigIn(await directory())).toBeNull();
  });

  test.each(["nubbin.config.ts", "nubbin.config.js"])("names %s when it is there", async (name) => {
    const cwd = await directory();
    await writeFile(join(cwd, name), "");
    expect(await existingConfigIn(cwd)).toBe(name);
  });

  test("TypeScript wins where both are present, as the config search prefers it", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "nubbin.config.js"), "");
    await writeFile(join(cwd, "nubbin.config.ts"), "");
    expect(await existingConfigIn(cwd)).toBe("nubbin.config.ts");
  });

  test("looks in the directory given and never climbs", async () => {
    const parent = await directory();
    await writeFile(join(parent, "nubbin.config.ts"), "");
    const child = join(parent, "app");
    await mkdir(child);
    expect(await existingConfigIn(child)).toBeNull();
  });
});
