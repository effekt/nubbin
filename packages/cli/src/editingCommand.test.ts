import { describe, expect, test } from "vitest";
import { editingCommand } from "./editingCommand";
import { editableProject } from "./testing/editableProject";

describe("editingCommand", () => {
  test("loads the route's document, applies the edit, saves it, and prints what changed", async () => {
    const { config, saved } = await editableProject();
    const verb = editingCommand((context) => ({
      edited: context.version,
      changed: `touched ${context.route}`,
    }));
    const outcome = await verb(config, { positionals: ["/pricing"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual(["touched /pricing"]);
    expect(saved.get("/pricing")?.documentId).toBe("pricing");
  });

  test("what the compile reported without refusing travels as warnings, not lines", async () => {
    const { config } = await editableProject();
    const verb = editingCommand((context) => ({
      edited: context.version,
      changed: "kept",
    }));
    const outcome = await verb(config, { positionals: ["/extra-prop"] });
    expect(outcome.lines).toEqual(["kept"]);
    expect(outcome.warnings?.join("\n")).toContain("unknown-prop");
  });

  test("an edit that breaks the document refuses, and nothing is saved", async () => {
    const { config, saved } = await editableProject();
    const verb = editingCommand((context) => ({
      edited: { ...context.version, roots: [] },
      changed: "broke it",
    }));
    await expect(verb(config, { positionals: ["/"] })).rejects.toThrow(/no-roots|root/);
    expect(saved.size).toBe(0);
  });
});
