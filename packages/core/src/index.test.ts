import { expect, test } from "vitest";

test("the published surface exports exactly the documented API", async () => {
  const surface = Object.keys(await import("./index")).sort();
  expect(surface).toEqual([
    "CompileError",
    "addNode",
    "checkCompatibility",
    "checkRollback",
    "compile",
    "createRegistry",
    "defineBlock",
    "defineCatalog",
    "formatCompatibilityReport",
    "moveNode",
    "parseMatchKind",
    "removeNode",
    "richText",
    "setAtPath",
    "setNodeProp",
    "zodAdapter",
  ]);
});
