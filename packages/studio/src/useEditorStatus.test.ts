import { expect, test } from "vitest";

test("the React entry exports exactly the documented API", async () => {
  expect(Object.keys(await import("./useEditorStatus"))).toEqual(["useEditorStatus"]);
});
