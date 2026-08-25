import { expect, test } from "vitest";
import { toPuckChildren } from "./toPuckChildren";

test("an array of components passes through", () => {
  const child = { type: "Card", props: { id: "c1" } };
  expect(toPuckChildren([child])).toEqual([child]);
});

test("an empty slot is an empty list", () => {
  expect(toPuckChildren([])).toEqual([]);
});

test("a non-component in a slot stops the fold rather than vanishing", () => {
  expect(() => toPuckChildren([{ type: "Card" }])).toThrow(/not a component/);
});
