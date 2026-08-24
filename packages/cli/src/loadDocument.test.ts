import { describe, expect, test } from "vitest";
import { loadDocument } from "./loadDocument";
import { fixtureProject } from "./testing/fixtureProject";
import { UsageError } from "./UsageError";

describe("loadDocument", () => {
  test("returns the document the consumer's loader answered with", async () => {
    const { config } = await fixtureProject();
    expect((await loadDocument(config, "/pricing")).documentId).toBe("pricing");
  });

  test("refuses a route the loader has no document for, naming the route", async () => {
    const { config } = await fixtureProject();
    await expect(loadDocument(config, "/nowhere")).rejects.toThrow(/no document for \/nowhere/);
  });

  test("the refusal is a usage error, so nothing was attempted", async () => {
    const { config } = await fixtureProject();
    await expect(loadDocument(config, "/nowhere")).rejects.toBeInstanceOf(UsageError);
  });

  test("awaits a loader that answers asynchronously", async () => {
    const { config } = await fixtureProject();
    const slow = { ...config, document: async (route: string) => config.document(route) };
    expect((await loadDocument(slow, "/")).documentId).toBe("home");
  });
});
