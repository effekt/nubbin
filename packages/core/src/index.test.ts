import { expect, test } from "vitest";

test("the published surface exports exactly the documented API", async () => {
  const surface = Object.keys(await import("./index")).sort();
  expect(surface).toEqual([
    "NubbinError",
    "NubbinIssueCode",
    "RICH_TEXT_BLOCK_KINDS",
    "RICH_TEXT_MARKS",
    "addNode",
    "checkCompatibility",
    "checkRollback",
    "compile",
    "createRegistry",
    "defineBlock",
    "defineCatalog",
    "formatCompatibilityReport",
    "isRichTextBlockKind",
    "isRichTextMark",
    "moveNode",
    "parseMatchKind",
    "refuse",
    "removeNode",
    "richText",
    "setAtPath",
    "setNodeProp",
    "zodAdapter",
  ]);
});
