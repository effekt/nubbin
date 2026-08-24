import { readdir } from "node:fs/promises";
import { NubbinError } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { compileCommand } from "./compileCommand";
import { fixtureProject } from "./testing/fixtureProject";
import { UsageError } from "./UsageError";

describe("compileCommand", () => {
  test("reports the hash a route would publish as, and succeeds", async () => {
    const { config } = await fixtureProject();
    const outcome = await compileCommand(config, { positionals: ["/pricing"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines[0]).toMatch(/^\/pricing -> [0-9a-f]+$/);
  });

  test("writes nothing — the dry run leaves the store empty", async () => {
    const { config, root } = await fixtureProject();
    await compileCommand(config, { positionals: ["/pricing"] });
    expect(await readdir(root)).toEqual([]);
  });

  test("carries a key the schema did not keep as a warning beside the answer, not inside it", async () => {
    const { config } = await fixtureProject();
    const outcome = await compileCommand(config, { positionals: ["/extra-prop"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toHaveLength(1);
    expect(outcome.warnings?.join("\n")).toContain("unknown-prop");
  });

  test("lets a refusal through, so the runner can print its code", async () => {
    const { config } = await fixtureProject();
    await expect(compileCommand(config, { positionals: ["/unknown-block"] })).rejects.toThrow(
      NubbinError,
    );
  });

  test("refuses a route the consumer has no document for, naming the route", async () => {
    const { config } = await fixtureProject();
    await expect(compileCommand(config, { positionals: ["/nowhere"] })).rejects.toThrow(
      /no document for \/nowhere/,
    );
  });

  test("refuses to run with no route at all", async () => {
    const { config } = await fixtureProject();
    await expect(compileCommand(config, { positionals: [] })).rejects.toThrow(UsageError);
  });
});
