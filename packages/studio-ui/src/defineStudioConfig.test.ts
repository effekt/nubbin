import { createRegistry, defineCatalog } from "@nubbin/core";
import { expect, test } from "vitest";
import { defineStudioConfig } from "./defineStudioConfig";

test("returns the consumer binding unchanged", () => {
  const config = defineStudioConfig({
    catalog: defineCatalog({}),
    registry: createRegistry([]),
    blockRegistry: {},
    seedDocuments: {},
    resolveHole: async () => undefined,
    viewports: [{ width: 768, height: "auto", label: "md" }],
    artifactStoreDir: ".nubbin",
    consumerOrigin: "http://localhost:3000",
  });
  expect(config.viewports[0]?.label).toBe("md");
});
