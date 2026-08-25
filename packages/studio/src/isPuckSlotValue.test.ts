import { expect, test } from "vitest";
import { isPuckSlotValue } from "./isPuckSlotValue";

test("a non-empty array of components is a slot value", () => {
  expect(isPuckSlotValue([{ type: "Card", props: { id: "card-1" } }])).toBe(true);
});

test("an empty array is not — only the prior draft can settle it", () => {
  expect(isPuckSlotValue([])).toBe(false);
});

test("an array holding one non-component is not", () => {
  expect(isPuckSlotValue([{ type: "Card", props: { id: "card-1" } }, "stray"])).toBe(false);
});

test("an ordinary array prop of plain objects is not", () => {
  expect(isPuckSlotValue([{ label: "Home", href: "/" }])).toBe(false);
});

test("a non-array is not", () => {
  expect(isPuckSlotValue({ type: "Card", props: { id: "card-1" } })).toBe(false);
});
