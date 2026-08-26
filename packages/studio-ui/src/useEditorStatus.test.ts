import { expect, test } from "vitest";

test("exports the editor-status hook", async () => {
  expect(Object.keys(await import("./useEditorStatus"))).toEqual(["useEditorStatus"]);
});
