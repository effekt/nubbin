import { expect, test } from "vitest";
import { parseMoves } from "./parseMoves";

const move = { hash: "a1", documentVersion: 1, movedAt: "2026-08-24" };

test("null passes through — it is the no-history answer, not an error", () => {
  expect(parseMoves(null)).toBeNull();
});

test("a list of moves passes whole", () => {
  expect(parseMoves([move])).toEqual([move]);
});

test("one bad row spoils the list", () => {
  expect(parseMoves([move, { hash: "a2" }])).toBeUndefined();
});

test("a non-list is refused", () => {
  expect(parseMoves("a1")).toBeUndefined();
  expect(parseMoves(undefined)).toBeUndefined();
});
