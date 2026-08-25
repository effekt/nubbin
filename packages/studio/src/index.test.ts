import { expect, test } from "vitest";

test("the published surface exports exactly the documented API", async () => {
  expect(Object.keys(await import("./index")).sort()).toEqual([
    "createStatusStore",
    "defineStudioConfig",
    "editorStatusStore",
    "foldPuckChange",
    "fromPuckData",
    "isPuckSlotValue",
    "patchEditorStatus",
    "toDocsByBlock",
    "toPuckData",
    "toSlotConstraintsByBlock",
    "toSlotNamesByBlock",
  ]);
});
