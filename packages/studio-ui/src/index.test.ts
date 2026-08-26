import { expect, test } from "vitest";

test("exports exactly the optional UI contract", async () => {
  expect(Object.keys(await import("./index")).sort()).toEqual([
    "BlockPalette",
    "ConsumerOriginContext",
    "OutcomeNotice",
    "PaletteIcon",
    "PublishControl",
    "PuckApiBridge",
    "RouteSwitcher",
    "StudioEditor",
    "StudioOutline",
    "StudioStatusBar",
    "StudioToolbar",
    "ToolbarDocument",
    "puckAdapter",
    "selectPuckNode",
    "useCloseOnEscape",
    "useCloseOnOutsideClick",
    "useDraftSave",
    "useEditorStatus",
  ]);
});
