import { expect, test } from "vitest";
import { pastedLines } from "./pastedLines";

test("splits on any line ending, trims, and drops blanks", () => {
  expect(pastedLines("one\r\ntwo\n\n  three  \n")).toEqual(["one", "two", "three"]);
});

test("a single line is one line", () => {
  expect(pastedLines("just a sentence")).toEqual(["just a sentence"]);
});

test("whitespace-only text folds to nothing", () => {
  expect(pastedLines(" \n \r\n ")).toEqual([]);
});
