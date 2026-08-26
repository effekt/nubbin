import { expect, test } from "vitest";
import { isTopLevelFieldPath } from "./isTopLevelFieldPath";

test("a bare prop name is top-level", () => {
  expect(isTopLevelFieldPath("headline")).toBe(true);
});

test("an array prop is top-level even though its rows are not", () => {
  expect(isTopLevelFieldPath("items")).toBe(true);
});

test("a dotted path names a nested field, not a prop", () => {
  expect(isTopLevelFieldPath("cta.label")).toBe(false);
});

test("an array-member path names every row rather than a prop", () => {
  expect(isTopLevelFieldPath("items[]")).toBe(false);
  expect(isTopLevelFieldPath("items[].title")).toBe(false);
});
