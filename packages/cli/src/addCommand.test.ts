import { NubbinError } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { addCommand } from "./addCommand";
import { editableProject } from "./testing/editableProject";
import { fixtureProject } from "./testing/fixtureProject";

const place = { parent: "n1", slot: "body" };

describe("addCommand", () => {
  test("prints the minted id, and the saved document holds that node in the slot", async () => {
    const { config, saved } = await editableProject();
    const outcome = await addCommand(config, { positionals: ["/sectioned", "Hero"], ...place });
    expect(outcome.code).toBe(0);
    const id = outcome.lines[0]?.split(" -> ")[1] ?? "";
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    const doc = saved.get("/sectioned");
    expect(doc?.elements[id]?.block).toBe("Hero");
    expect(doc?.elements.n1?.slots?.body).toEqual(["n2", "n3", id]);
  });

  test("seeds the node's props from the catalog defaults, which is what lets it compile", async () => {
    const { config, saved } = await editableProject();
    const outcome = await addCommand(config, { positionals: ["/sectioned", "Hero"], ...place });
    const id = outcome.lines[0]?.split(" -> ")[1] ?? "";
    expect(saved.get("/sectioned")?.elements[id]?.props).toEqual({ title: "Untitled" });
  });

  test("--index places the node at the position rather than the end", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "Hero"], ...place, index: 0 };
    const outcome = await addCommand(config, args);
    const id = outcome.lines[0]?.split(" -> ")[1] ?? "";
    expect(saved.get("/sectioned")?.elements.n1?.slots?.body).toEqual([id, "n2", "n3"]);
  });

  test("refuses when the config has no save, before minting anything", async () => {
    const { config } = await fixtureProject();
    const args = { positionals: ["/sectioned", "Hero"], ...place };
    await expect(addCommand(config, args)).rejects.toThrow(/no save/);
  });

  test("refuses a block the registry does not hold, and saves nothing", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "Ghost"], ...place };
    await expect(addCommand(config, args)).rejects.toBeInstanceOf(NubbinError);
    expect(saved.size).toBe(0);
  });

  test("refuses a block the slot's allow does not admit, and saves nothing", async () => {
    const { config, saved } = await editableProject();
    const args = { positionals: ["/sectioned", "Section"], ...place };
    const refusal = await addCommand(config, args).catch((error: NubbinError) => error);
    expect(refusal).toBeInstanceOf(NubbinError);
    expect((refusal as NubbinError).code).toBe("slot-not-allowed");
    expect(saved.size).toBe(0);
  });

  test.each([
    [{ positionals: ["/sectioned", "Hero"], slot: "body" }, /--parent/],
    [{ positionals: ["/sectioned", "Hero"], parent: "n1" }, /--slot/],
    [{ positionals: ["/sectioned"], ...place }, /needs a block/],
  ])("refuses incomplete addressing: %j", async (args, said) => {
    const { config } = await editableProject();
    await expect(addCommand(config, args)).rejects.toThrow(said);
  });
});
