import { describe, expect, test } from "vitest";
import { showCommand } from "./showCommand";
import { fixtureProject } from "./testing/fixtureProject";

describe("showCommand", () => {
  test("prints the tree a write command addresses, and writes nothing", async () => {
    const { config, root } = await fixtureProject();
    const outcome = await showCommand(config, { positionals: ["/"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines.join("\n")).toContain("n1  Hero");
    const { readdir } = await import("node:fs/promises");
    expect(await readdir(root)).toEqual([]);
  });

  test("refuses a route the consumer has no document for, naming it", async () => {
    const { config } = await fixtureProject();
    await expect(showCommand(config, { positionals: ["/nowhere"] })).rejects.toThrow(
      /no document for \/nowhere/,
    );
  });

  test("shows a document the registry would refuse, because ids are what it is for", async () => {
    const { config } = await fixtureProject();
    const outcome = await showCommand(config, { positionals: ["/unknown-block"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines.join("\n")).toContain("Ghost");
  });
});
