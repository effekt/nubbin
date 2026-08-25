import { expect, test } from "vitest";

test("the published surface exports exactly the documented API", async () => {
  expect(Object.keys(await import("./index")).sort()).toEqual([
    "createStatusStore",
    "createStudioHttpClient",
    "defineStudioConfig",
    "editorStatusStore",
    "foldPuckChange",
    "fromPuckData",
    "humanizeFieldPath",
    "isDocumentVersionShape",
    "isPuckSlotValue",
    "overLimitLine",
    "parseDraftSaveRequest",
    "parseRollbackRequest",
    "parseRouteCreateRequest",
    "patchEditorStatus",
    "toAuthorIssues",
    "toDocsByBlock",
    "toIconByBlock",
    "toPaletteGroups",
    "toPuckData",
    "toSlotConstraintsByBlock",
    "toSlotNamesByBlock",
  ]);
});
