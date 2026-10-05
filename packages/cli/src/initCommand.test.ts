import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { initCommand } from "./initCommand";
import { INIT_CONFIG_SOURCE } from "./initConfigSource.constants";
import { defaultPlan } from "./plan/defaultPlan";
import { UsageError } from "./UsageError";

const directory = (): Promise<string> => mkdtemp(join(tmpdir(), "nubbin-cli-init-"));

const init = (cwd: string, ...positionals: string[]) => initCommand(cwd, { positionals });

const DEFAULT_CODE = "v1-aaaaaaaa000aaa";

/** What the default plan prints, before the outcome line and the code. */
const DEFAULT_PRINTOUT = [
  "You run Studio and keep drafts on your own infrastructure. You store and serve published artifacts yourself, and your application reads them at build time.",
  "You run: Application, Components, Studio, Draft storage, Publishing, Artifact store, Delivery, Assets, Operations",
  "Nubbin runs: nothing",
  "1. Install the packages",
  "   $ npm install @nubbin/core @nubbin/react @nubbin/next @nubbin/store-fs @nubbin/studio @nubbin/studio-ui && npm install -D @nubbin/cli",
  "2. Register the components authors may use",
  "3. Run Studio and save drafts",
  "4. Publish a route",
  "   $ npx nubbin publish /pricing",
  "5. Store artifacts where your application can read them",
  "6. Render an artifact",
];

describe("initCommand", () => {
  test("a self-run plan prints the plan, writes the config, and ends with the code", async () => {
    const cwd = await directory();
    const outcome = await init(cwd, DEFAULT_CODE);
    expect(outcome.lines).toEqual([
      ...DEFAULT_PRINTOUT,
      "wrote nubbin.config.ts",
      `Plan: ${DEFAULT_CODE}`,
    ]);
    expect(outcome.code).toBe(0);
    expect(await readFile(join(cwd, "nubbin.config.ts"), "utf8")).toBe(INIT_CONFIG_SOURCE);
  });

  test("the same plan as a JSON file prints the same lines and writes the same file", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "plan.json"), JSON.stringify(defaultPlan));
    const outcome = await init(cwd, "plan.json");
    expect(outcome.lines).toEqual([
      ...DEFAULT_PRINTOUT,
      "wrote nubbin.config.ts",
      `Plan: ${DEFAULT_CODE}`,
    ]);
    expect(outcome.code).toBe(0);
    expect(await readFile(join(cwd, "nubbin.config.ts"), "utf8")).toBe(INIT_CONFIG_SOURCE);
  });

  test("a plan file saved with a byte order mark reads as the plain one does", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "plan.json"), `﻿${JSON.stringify(defaultPlan)}`);
    const outcome = await init(cwd, "plan.json");
    expect(outcome.lines).toEqual([
      ...DEFAULT_PRINTOUT,
      "wrote nubbin.config.ts",
      `Plan: ${DEFAULT_CODE}`,
    ]);
    expect(outcome.code).toBe(0);
  });

  test("an inconsistent plan prints only its issues, writes nothing, and is refused", async () => {
    const cwd = await directory();
    const outcome = await init(cwd, "v1-aaaaaaba000aaa");
    expect(outcome).toEqual({
      lines: ["artifacts: Nubbin can only serve artifacts it stores."],
      code: 1,
    });
    expect(await readdir(cwd)).toEqual([]);
  });

  test("a plan whose artifacts are Nubbin's is printed, names the field, and writes nothing", async () => {
    const cwd = await directory();
    const outcome = await init(cwd, "v1-aaaaabaa000aaa");
    expect(outcome.code).toBe(0);
    expect(outcome.lines[2]).toBe("Nubbin runs: Artifact store");
    expect(outcome.lines.slice(-2)).toEqual([
      "wrote nothing: artifacts are Nubbin's, and a config can only name a store you run",
      "Plan: v1-aaaaabaa000aaa",
    ]);
    expect(await readdir(cwd)).toEqual([]);
  });

  test.each(["nubbin.config.ts", "nubbin.config.js"])(
    "an existing %s is left byte-identical, named, and the run is refused",
    async (name) => {
      const cwd = await directory();
      await writeFile(join(cwd, name), "export default {};\n");
      const outcome = await init(cwd, DEFAULT_CODE);
      expect(outcome.code).toBe(1);
      expect(outcome.lines.slice(0, DEFAULT_PRINTOUT.length)).toEqual(DEFAULT_PRINTOUT);
      expect(outcome.lines.slice(-2)).toEqual([
        `wrote nothing: ${name} already exists`,
        `Plan: ${DEFAULT_CODE}`,
      ]);
      expect(await readdir(cwd)).toEqual([name]);
      expect(await readFile(join(cwd, name), "utf8")).toBe("export default {};\n");
    },
  );

  test("the code is the last line whatever the outcome, so a reader can always paste it", async () => {
    for (const code of [DEFAULT_CODE, "v1-aaaaabaa000aaa", "v1-aaabaaaa000aaa"]) {
      expect((await init(await directory(), code)).lines.at(-1)).toBe(`Plan: ${code}`);
    }
  });

  test.each([
    [[], "this command needs a plan code or plan file"],
    [["v1-nonsense"], "not a plan code: v1-nonsense"],
    [["missing.json"], "no plan file at missing.json"],
  ])("refuses %j as a usage error: %s", async (positionals, message) => {
    const attempt = init(await directory(), ...positionals);
    await expect(attempt).rejects.toThrow(UsageError);
    await expect(attempt).rejects.toThrow(message);
  });

  test("bad JSON and a schema-rejected file are usage errors naming the file", async () => {
    const cwd = await directory();
    await writeFile(join(cwd, "broken.json"), "{");
    await writeFile(join(cwd, "shape.json"), JSON.stringify({ framework: "next" }));
    await expect(init(cwd, "broken.json")).rejects.toThrow(/^broken\.json is not JSON: /);
    await expect(init(cwd, "shape.json")).rejects.toThrow("shape.json is not a plan:");
  });
});
