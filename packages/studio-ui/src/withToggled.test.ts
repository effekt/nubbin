import { expect, test } from "vitest";
import { withToggled } from "./withToggled";

test("an absent member is added and a present one removed", () => {
  const once = withToggled(new Set(), "Layout");
  expect(once.has("Layout")).toBe(true);
  const twice = withToggled(once, "Layout");
  expect(twice.has("Layout")).toBe(false);
});

test("the given set is left untouched", () => {
  const before = new Set(["Content"]);
  withToggled(before, "Content");
  expect(before.has("Content")).toBe(true);
});
