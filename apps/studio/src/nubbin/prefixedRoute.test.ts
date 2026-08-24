import { expect, test } from "vitest";
import { prefixedRoute } from "./prefixedRoute";

test("the root route collapses to the bare prefix", () => {
  expect(prefixedRoute("/preview", "/")).toBe("/preview");
});

test("a nested route appends to the prefix", () => {
  expect(prefixedRoute("/preview", "/dispatches/tide-tables")).toBe(
    "/preview/dispatches/tide-tables",
  );
});
