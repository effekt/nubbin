import { expect, test } from "vitest";
import { isPuckComponentData } from "./isPuckComponentData";

test("a component with a type and a string props.id is one", () => {
  expect(isPuckComponentData({ type: "Card", props: { id: "card-1", title: "T" } })).toBe(true);
});

test.each([
  ["a primitive", "Card"],
  ["null", null],
  ["a missing type", { props: { id: "card-1" } }],
  ["a non-string type", { type: 1, props: { id: "card-1" } }],
  ["missing props", { type: "Card" }],
  ["null props", { type: "Card", props: null }],
  ["props with no id", { type: "Card", props: { title: "T" } }],
  ["props with a non-string id", { type: "Card", props: { id: 7 } }],
])("%s is not one", (_label, value) => {
  expect(isPuckComponentData(value)).toBe(false);
});
