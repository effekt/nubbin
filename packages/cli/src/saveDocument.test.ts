import { NubbinError } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { loadDocument } from "./loadDocument";
import { saveDocument } from "./saveDocument";
import { editableProject } from "./testing/editableProject";
import { fixtureProject } from "./testing/fixtureProject";
import { UsageError } from "./UsageError";

describe("saveDocument", () => {
  test("compiles, persists through save, and returns what compile reported", async () => {
    const { config, saved } = await editableProject();
    const version = await loadDocument(config, "/extra-prop");
    const issues = await saveDocument(config, "/extra-prop", version);
    expect(saved.get("/extra-prop")).toBe(version);
    expect(issues.map((issue) => issue.code)).toContain("unknown-prop");
  });

  test("refuses when the config has no save, naming the config", async () => {
    const { config } = await fixtureProject();
    const version = await loadDocument(config, "/");
    await expect(saveDocument(config, "/", version)).rejects.toThrow(/nubbin\.config/);
    await expect(saveDocument(config, "/", version)).rejects.toBeInstanceOf(UsageError);
  });

  test("refuses a document that cannot compile, and save is never called", async () => {
    const { config, saved } = await editableProject();
    const version = await loadDocument(config, "/");
    const rootless = { ...version, roots: [] };
    await expect(saveDocument(config, "/", rootless)).rejects.toBeInstanceOf(NubbinError);
    expect(saved.size).toBe(0);
  });

  test("a config that cannot persist is refused before the document is judged", async () => {
    const { config } = await fixtureProject();
    const version = await loadDocument(config, "/");
    const rootless = { ...version, roots: [] };
    await expect(saveDocument(config, "/", rootless)).rejects.toBeInstanceOf(UsageError);
  });
});
