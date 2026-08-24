import { describe, expect, test } from "vitest";
import { loadDocument } from "./loadDocument";
import { refuseHintedPath } from "./refuseHintedPath";
import { fixtureProject } from "./testing/fixtureProject";

describe("refuseHintedPath", () => {
  test("refuses a hinted path, naming the field and the block", async () => {
    const { config } = await fixtureProject();
    const version = await loadDocument(config, "/sectioned");
    expect(() => refuseHintedPath(config.catalog, version, "n1", "tagline")).toThrow(
      /"tagline" on Section resolves per request/,
    );
  });

  test("lets an unhinted path through", async () => {
    const { config } = await fixtureProject();
    const version = await loadDocument(config, "/sectioned");
    expect(() => refuseHintedPath(config.catalog, version, "n2", "title")).not.toThrow();
  });

  test("says nothing about a node the document does not hold — setNodeProp names it", async () => {
    const { config } = await fixtureProject();
    const version = await loadDocument(config, "/sectioned");
    expect(() => refuseHintedPath(config.catalog, version, "nx", "tagline")).not.toThrow();
  });
});
