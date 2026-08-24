import { expect, test } from "vitest";
import { isNubbinIssueShape } from "./isNubbinIssueShape";

test("a full compiler issue passes", () => {
  expect(
    isNubbinIssueShape({ code: "invalid-props", message: "expected string", at: "n1", path: "x" }),
  ).toBe(true);
});

test("message alone is enough — at and path are where the compiler placed it", () => {
  expect(isNubbinIssueShape({ message: "route is taken" })).toBe(true);
});

test.each([null, "text", 4, { at: "n1" }, { message: 7 }, { message: "m", at: 3 }])(
  "%j is not an issue",
  (value) => {
    expect(isNubbinIssueShape(value)).toBe(false);
  },
);
