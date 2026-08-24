import { expect, test } from "vitest";
import { isBlockMatch } from "./isBlockMatch";

const hero = { name: "Hero", description: "The opening statement of a page." };

test("matches against the name, case-insensitively", () => {
  expect(isBlockMatch("hero", hero)).toBe(true);
  expect(isBlockMatch("HER", hero)).toBe(true);
  expect(isBlockMatch("card", hero)).toBe(false);
});

test("matches against the description, so a block is findable by what it is for", () => {
  expect(isBlockMatch("opening", hero)).toBe(true);
  expect(isBlockMatch("OPENING STATEMENT", hero)).toBe(true);
});

test("a blank or whitespace query keeps every block", () => {
  expect(isBlockMatch("", hero)).toBe(true);
  expect(isBlockMatch("   ", hero)).toBe(true);
});

test("a block without a description still matches by name, and only by name", () => {
  expect(isBlockMatch("split", { name: "Split" })).toBe(true);
  expect(isBlockMatch("opening", { name: "Split" })).toBe(false);
});

test("surrounding whitespace in the query is not part of the search", () => {
  expect(isBlockMatch("  hero  ", hero)).toBe(true);
});
