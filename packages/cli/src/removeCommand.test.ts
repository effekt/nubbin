import { NubbinError } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { removeCommand } from "./removeCommand";
import { editableProject } from "./testing/editableProject";
import { fixtureProject } from "./testing/fixtureProject";

describe("removeCommand", () => {
  test("removes the node from the saved document, and its slot reference with it", async () => {
    const { config, saved } = await editableProject();
    const outcome = await removeCommand(config, { positionals: ["/sectioned", "n3"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual(["removed n3 from /sectioned"]);
    const doc = saved.get("/sectioned");
    expect(doc?.elements.n3).toBeUndefined();
    expect(doc?.elements.n1?.slots?.body).toEqual(["n2"]);
  });

  test("removes everything beneath the node, which is what removing a section means", async () => {
    const { config, saved } = await editableProject();
    await removeCommand(config, { positionals: ["/sectioned", "n1"] });
    const doc = saved.get("/sectioned");
    expect(Object.keys(doc?.elements ?? {})).toEqual(["n4", "n5"]);
    expect(doc?.roots).toEqual(["n4", "n5"]);
  });

  test("refuses a removal that leaves no roots, and saves nothing", async () => {
    const { config, saved } = await editableProject();
    const refusal = await removeCommand(config, { positionals: ["/", "n1"] }).catch(
      (error: NubbinError) => error,
    );
    expect(refusal).toBeInstanceOf(NubbinError);
    expect((refusal as NubbinError).code).toBe("no-roots");
    expect(saved.size).toBe(0);
  });

  test("refuses when the config has no save", async () => {
    const { config } = await fixtureProject();
    const args = { positionals: ["/sectioned", "n3"] };
    await expect(removeCommand(config, args)).rejects.toThrow(/no save/);
  });

  test("refuses with no node id, saying which argument is missing", async () => {
    const { config } = await editableProject();
    await expect(removeCommand(config, { positionals: ["/sectioned"] })).rejects.toThrow(
      /needs a node id/,
    );
  });
});
