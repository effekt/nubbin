import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { COMMANDS } from "./commands.constants";
import { USAGE } from "./usage.constants";

const doc = (path: string): string => readFileSync(resolve(import.meta.dirname, path), "utf8");

describe("the usage text", () => {
  test("names every command the bin dispatches", () => {
    for (const name of Object.keys(COMMANDS)) {
      expect(USAGE).toMatch(new RegExp(`^ {2}${name}\\b`, "m"));
    }
  });

  // `help` lives in the runner rather than the command table, so nothing derives it into the
  // usage text — it has to be stated, and this is what notices it going missing.
  test("names help, which no command table carries", () => {
    expect(USAGE).toMatch(/^ {2}help\b/m);
  });

  test("the README and the reference page name help beside the other commands", () => {
    expect(doc("../README.md")).toContain("nubbin help");
    expect(doc("../../../docs/reference/cli.md")).toMatch(/`help`/);
  });
});
