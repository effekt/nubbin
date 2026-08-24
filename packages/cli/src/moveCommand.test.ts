import { NubbinError } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { moveCommand } from "./moveCommand";
import { editableProject } from "./testing/editableProject";
import { fixtureProject } from "./testing/fixtureProject";

describe("moveCommand", () => {
  test("moves the node to the position, and the saved document holds the new order", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "n3"], parent: "n1", slot: "body", index: 0 };
    const outcome = await moveCommand(config, args);
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual(["moved n3 to n1.body in /sectioned"]);
    expect(saved.get("/sectioned")?.elements.n1?.slots?.body).toEqual(["n3", "n2"]);
  });

  test("a root moved into a slot stops being a root in the saved document", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "n5"], parent: "n1", slot: "body" };
    await moveCommand(config, args);
    const doc = saved.get("/sectioned");
    expect(doc?.roots).toEqual(["n1", "n4"]);
    expect(doc?.elements.n1?.slots?.body).toEqual(["n2", "n3", "n5"]);
  });

  test("refuses a move the slot's allow forbids, and saves nothing", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "n4"], parent: "n1", slot: "body" };
    const refusal = await moveCommand(config, args).catch((error: NubbinError) => error);
    expect(refusal).toBeInstanceOf(NubbinError);
    expect((refusal as NubbinError).code).toBe("slot-not-allowed");
    expect(saved.size).toBe(0);
  });

  test("refuses a move into the node's own subtree, which cannot compile", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "n1"], parent: "n1", slot: "body" };
    await expect(moveCommand(config, args)).rejects.toBeInstanceOf(NubbinError);
    expect(saved.size).toBe(0);
  });

  test("refuses when the config has no save", async () => {
    const { config } = await fixtureProject();
    const args = { positionals: ["/sectioned", "n3"], parent: "n1", slot: "body" };
    await expect(moveCommand(config, args)).rejects.toThrow(/no save/);
  });

  test("refuses a missing --parent by name", async () => {
    const { config } = await editableProject();
    const args = { positionals: ["/sectioned", "n3"], slot: "body" };
    await expect(moveCommand(config, args)).rejects.toThrow(/--parent/);
  });
});
