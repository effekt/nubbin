import { expect, test } from "vitest";
import { isBlockMatch } from "./isBlockMatch";

const hero = { name: "Hero", description: "The opening statement of a page." };

test("matches names and descriptions case-insensitively", () => {
  expect(isBlockMatch("HER", hero)).toBe(true);
  expect(isBlockMatch("OPENING STATEMENT", hero)).toBe(true);
  expect(isBlockMatch("card", hero)).toBe(false);
});
test("blank queries retain every block", () => {
  expect(isBlockMatch("   ", hero)).toBe(true);
});
test("description-less blocks still match by name", () => {
  expect(isBlockMatch("split", { name: "Split" })).toBe(true);
  expect(isBlockMatch("opening", { name: "Split" })).toBe(false);
});
