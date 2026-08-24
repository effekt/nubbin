import { expect, test } from "vitest";
import { blockCalloutLine } from "./blockCalloutLine";

test("names the block, the count and the reassurance", () => {
  expect(blockCalloutLine("Hero", 2)).toBe(
    "Hero has 2 things to fix. Your edits are saved — the page just can't go live until they're resolved.",
  );
});

test("stays grammatical at one", () => {
  expect(blockCalloutLine("Hero", 1)).toContain("Hero has 1 thing to fix.");
});
