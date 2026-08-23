import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { runCli } from "./runCli";

const nowhere = (): Promise<string> => mkdtemp(join(tmpdir(), "nubbin-cli-run-"));

describe("runCli", () => {
  test("printing the usage on request succeeds", async () => {
    const outcome = await runCli(["help"], await nowhere());
    expect(outcome.code).toBe(0);
    expect(outcome.lines.join("\n")).toContain("nubbin <command>");
  });

  test("naming no command at all is a usage error, not a help request", async () => {
    expect((await runCli([], await nowhere())).code).toBe(2);
  });

  test("names the command it does not have", async () => {
    const outcome = await runCli(["pubish", "/pricing"], await nowhere());
    expect(outcome.lines[0]).toBe("no command named pubish");
    expect(outcome.code).toBe(2);
  });

  test("a command run where there is no config says so, and exits as a usage error", async () => {
    const outcome = await runCli(["publish", "/pricing"], await nowhere());
    expect(outcome.lines.join("\n")).toMatch(/no nubbin\.config\.ts found/);
    expect(outcome.code).toBe(2);
  });

  test("an unknown flag stops the run before any config is loaded", async () => {
    const outcome = await runCli(["publish", "/pricing", "--orgin", "x"], await nowhere());
    expect(outcome.code).toBe(2);
  });
});
