import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { INIT_CONFIG_SOURCE } from "./initConfigSource.constants";
import { defaultPlan } from "./plan/defaultPlan";
import { writeInitConfig } from "./writeInitConfig";

const directory = (): Promise<string> => mkdtemp(join(tmpdir(), "nubbin-cli-write-init-"));

describe("writeInitConfig", () => {
  test("writes the config where the publish path is the customer's, and says so", async () => {
    const cwd = await directory();
    expect(await writeInitConfig(cwd, defaultPlan)).toEqual({
      lines: ["wrote nubbin.config.ts"],
      code: 0,
    });
    expect(await readFile(join(cwd, "nubbin.config.ts"), "utf8")).toBe(INIT_CONFIG_SOURCE);
  });

  test.each([
    ["drafts", "wrote nothing: drafts are Nubbin's, and a config can only read drafts you keep"],
    [
      "publishing",
      "wrote nothing: publishing is Nubbin's, so there is no terminal publish path to configure",
    ],
    [
      "artifacts",
      "wrote nothing: artifacts are Nubbin's, and a config can only name a store you run",
    ],
  ] as const)(
    "writes nothing when %s is Nubbin's, naming it, and succeeds",
    async (field, line) => {
      const cwd = await directory();
      expect(await writeInitConfig(cwd, { ...defaultPlan, [field]: "nubbin" })).toEqual({
        lines: [line],
        code: 0,
      });
      expect(await readdir(cwd)).toEqual([]);
    },
  );

  test.each(["nubbin.config.ts", "nubbin.config.js"])(
    "refuses to touch an existing %s, leaving it byte-identical",
    async (name) => {
      const cwd = await directory();
      await writeFile(join(cwd, name), "export default {};\n");
      expect(await writeInitConfig(cwd, defaultPlan)).toEqual({
        lines: [`wrote nothing: ${name} already exists`],
        code: 1,
      });
      expect(await readdir(cwd)).toEqual([name]);
      expect(await readFile(join(cwd, name), "utf8")).toBe("export default {};\n");
    },
  );

  test("a Nubbin-run stage is answered before an existing config is looked for", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "nubbin.config.ts"), "");
    const outcome = await writeInitConfig(cwd, { ...defaultPlan, artifacts: "nubbin" });
    expect(outcome.code).toBe(0);
    expect(outcome.lines[0]).toMatch(/^wrote nothing: artifacts are Nubbin's/);
  });
});
