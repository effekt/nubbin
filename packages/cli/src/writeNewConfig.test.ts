import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { INIT_CONFIG_SOURCE } from "./initConfigSource.constants";
import { writeNewConfig } from "./writeNewConfig";

const directory = (): Promise<string> => mkdtemp(join(tmpdir(), "nubbin-cli-write-new-"));

describe("writeNewConfig", () => {
  test("writes the config and says so", async () => {
    const cwd = await directory();
    expect(await writeNewConfig(cwd)).toEqual({ lines: ["wrote nubbin.config.ts"], code: 0 });
    expect(await readFile(join(cwd, "nubbin.config.ts"), "utf8")).toBe(INIT_CONFIG_SOURCE);
  });

  // The race `writeInitConfig` cannot otherwise show: a config that appeared after the existence
  // check passed. Nothing checks here before the write, so a file already present is exactly
  // that case, and the answer has to be the same line the pre-check gives.
  test("a config that appears before the write is refused by name, not as a raw EEXIST", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "nubbin.config.ts"), "export default {};\n");
    expect(await writeNewConfig(cwd)).toEqual({
      lines: ["wrote nothing: nubbin.config.ts already exists"],
      code: 1,
    });
    expect(await readdir(cwd)).toEqual(["nubbin.config.ts"]);
    expect(await readFile(join(cwd, "nubbin.config.ts"), "utf8")).toBe("export default {};\n");
  });

  test("any other failure to write is raised as it came", async () => {
    const cwd = await directory();
    await expect(writeNewConfig(join(cwd, "missing", "deeper"))).rejects.toThrow(/ENOENT/);
  });
});
