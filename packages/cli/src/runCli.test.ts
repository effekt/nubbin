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
    expect(outcome.lines.join("\n")).toMatch(/no nubbin\.config\.ts/);
    expect(outcome.code).toBe(2);
  });

  test("refuses an argument the command does not read, rather than ignoring it", async () => {
    const outcome = await runCli(["check", "/pricing"], await nowhere());
    expect(outcome.lines.join("\n")).toMatch(/check reads 0 argument/);
    expect(outcome.code).toBe(2);
  });

  test("refuses --origin on a command that moves no pointer", async () => {
    const outcome = await runCli(["status", "--origin", "http://localhost:3000"], await nowhere());
    expect(outcome.lines.join("\n")).toMatch(/status moves no pointer/);
    expect(outcome.code).toBe(2);
  });

  test("refuses --to on a command that resolves no document version", async () => {
    const outcome = await runCli(["publish", "/pricing", "--to", "3"], await nowhere());
    expect(outcome.lines.join("\n")).toMatch(/publish resolves no document version/);
    expect(outcome.code).toBe(2);
  });

  test("an unknown flag stops the run before any config is loaded", async () => {
    const outcome = await runCli(["publish", "/pricing", "--orgin", "x"], await nowhere());
    expect(outcome.code).toBe(2);
  });
});
