import { NubbinError } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { setCommand } from "./setCommand";
import { editableProject } from "./testing/editableProject";
import { fixtureProject } from "./testing/fixtureProject";

describe("setCommand", () => {
  test("a value that parses as JSON arrives typed in the saved document", async () => {
    const { config, saved } = await editableProject();
    const outcome = await setCommand(config, { positionals: ["/sectioned", "n2", "rank", "42"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual(["set rank on n2 in /sectioned"]);
    expect(saved.get("/sectioned")?.elements.n2?.props.rank).toBe(42);
  });

  test("a value JSON refuses arrives as the string given", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "n2", "title", "Renamed by the CLI"] };
    await setCommand(config, args);
    expect(saved.get("/sectioned")?.elements.n2?.props.title).toBe("Renamed by the CLI");
  });

  test("refuses a path carrying a data hint by name, and saves nothing", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "n1", "tagline", "stale by design"] };
    await expect(setCommand(config, args)).rejects.toThrow(
      /"tagline" on Section resolves per request/,
    );
    expect(saved.size).toBe(0);
  });

  test("refuses a value the schema refuses, and saves nothing", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "n2", "title", "42"] };
    const refusal = await setCommand(config, args).catch((error: NubbinError) => error);
    expect(refusal).toBeInstanceOf(NubbinError);
    expect((refusal as NubbinError).code).toBe("invalid-props");
    expect(saved.size).toBe(0);
  });

  test("refuses a node the document does not hold, naming it", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "nx", "title", "x"] };
    const refusal = await setCommand(config, args).catch((error: NubbinError) => error);
    expect(refusal).toBeInstanceOf(NubbinError);
    expect((refusal as NubbinError).code).toBe("no-such-node");
    expect(saved.size).toBe(0);
  });

  test("refuses when the config has no save", async () => {
    const { config } = await fixtureProject();
    const args = { positionals: ["/sectioned", "n2", "title", "x"] };
    await expect(setCommand(config, args)).rejects.toThrow(/no save/);
  });

  test("refuses with fewer positionals than a set needs, naming the first missing", async () => {
    const { config } = await editableProject();
    await expect(
      setCommand(config, { positionals: ["/sectioned", "n2", "title"] }),
    ).rejects.toThrow(/needs a value/);
  });
});
