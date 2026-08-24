import { expect, test } from "vitest";
import { nonEmptyPath } from "./nonEmptyPath";

test("a real path passes through untouched", () => {
  expect(nonEmptyPath("stats.0.label")).toBe("stats.0.label");
});

test("the compiler's empty join and an absent path both come back undefined", () => {
  expect(nonEmptyPath("")).toBeUndefined();
  expect(nonEmptyPath(undefined)).toBeUndefined();
});
