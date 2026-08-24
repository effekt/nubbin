import { expect, test } from "vitest";
import { editorStatusStore } from "./editorStatusStore";

test("starts with no issues, the dropdown closed, and changes assumed unpublished", () => {
  expect(editorStatusStore.get()).toEqual({ issues: [], issuesOpen: false, published: false });
});
