import { expect, test } from "vitest";

test("exports exactly the optional UI contract", async () => {
  expect(Object.keys(await import("./index")).sort()).toEqual([
    "ConsumerOriginContext",
    "OutcomeNotice",
    "PublishControl",
    "StudioEditor",
    "StudioStatusBar",
    "StudioToolbar",
    "puckAdapter",
    "useCloseOnEscape",
    "useCloseOnOutsideClick",
    "useDraftSave",
    "useEditorStatus",
  ]);
});
