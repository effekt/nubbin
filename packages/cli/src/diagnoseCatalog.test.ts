import { createRegistry } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { diagnoseCatalog } from "./diagnoseCatalog";
import { projectAt } from "./testing/projectAt";

describe("diagnoseCatalog", () => {
  test("passes matching names and names both directions of drift", () => {
    const config = projectAt("unused");
    expect(diagnoseCatalog(config.catalog, config.registry).failures).toEqual([]);
    expect(diagnoseCatalog(config.catalog, createRegistry([])).failures).toEqual([
      "Hero is in the catalog but not the registry",
      "Section is in the catalog but not the registry",
    ]);
    expect(diagnoseCatalog({}, config.registry).failures).toEqual([
      "Hero is in the registry but not the catalog",
      "Section is in the registry but not the catalog",
    ]);
  });
});
