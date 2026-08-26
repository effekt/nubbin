import { expect, test } from "vitest";
import { issuesHeading } from "./issuesHeading";

test("counts the plural case", () => {
  expect(issuesHeading(3)).toBe("3 things need fixing before this can go live");
});

test("stays grammatical at one", () => {
  expect(issuesHeading(1)).toBe("1 thing needs fixing before this can go live");
});
