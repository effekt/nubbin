import { expect, test } from "vitest";

test("exports exactly the optional UI contract", async () => {
  expect(Object.keys(await import("./index")).sort()).toEqual([
    "ConsumerOriginContext",
    "OutcomeNotice",
    "StudioEditor",
    "StudioStatusBar",
    "puckAdapter",
    "useDraftSave",
    "useEditorStatus",
  ]);
});
