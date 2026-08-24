import type { Node } from "@nubbin/core";
import { expect, test } from "vitest";
import { isSlotEntry } from "./isSlotEntry";

const child = { type: "Card", props: { id: "c1" } };
const priorWithSlot: Node = { id: "n1", block: "Grid", props: {}, slots: { cards: ["c1"] } };

test("with declared slots, a declared name holding an array is a slot — empty included", () => {
  expect(isSlotEntry("cards", [child], undefined, ["cards"])).toBe(true);
  expect(isSlotEntry("cards", [], undefined, ["cards"])).toBe(true);
});

test("with declared slots, an undeclared key is a prop however component-shaped", () => {
  expect(isSlotEntry("rows", [child], undefined, ["cards"])).toBe(false);
});

test("with declared slots, a declared name holding a non-array is not a slot", () => {
  expect(isSlotEntry("cards", "text", undefined, ["cards"])).toBe(false);
});

test("without declared slots, a non-empty array of components reads as a slot", () => {
  expect(isSlotEntry("cards", [child], undefined, undefined)).toBe(true);
});

test("without declared slots, an empty array is a slot only when the prior node held it as one", () => {
  expect(isSlotEntry("cards", [], priorWithSlot, undefined)).toBe(true);
  expect(isSlotEntry("cards", [], undefined, undefined)).toBe(false);
});
