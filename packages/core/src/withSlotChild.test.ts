import { describe, expect, test } from "vitest";
import type { Node } from "./document.types";
import { withSlotChild } from "./withSlotChild";

const parent = (slots?: Record<string, string[]>): Node => ({
  id: "parent",
  block: "Stack",
  props: {},
  ...(slots === undefined ? {} : { slots }),
});

describe("withSlotChild", () => {
  test("appends when given no index", () => {
    expect(withSlotChild(parent({ items: ["a"] }), "items", "b").slots?.items).toEqual(["a", "b"]);
  });

  test("inserts at the index it was given", () => {
    expect(withSlotChild(parent({ items: ["a", "c"] }), "items", "b", 1).slots?.items).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  test("opens a slot the node has never filled", () => {
    expect(withSlotChild(parent({ items: [] }), "aside", "a").slots?.aside).toEqual(["a"]);
  });

  test("opens the first slot on a node that has none", () => {
    expect(withSlotChild(parent(), "items", "a").slots).toEqual({ items: ["a"] });
  });

  test("leaves the node's other slots alone", () => {
    const next = withSlotChild(parent({ l: ["a"], r: ["b"] }), "l", "c");
    expect(next.slots?.r).toEqual(["b"]);
  });

  test("does not mutate the node it was given", () => {
    const node = parent({ items: ["a"] });
    withSlotChild(node, "items", "b");
    expect(node.slots?.items).toEqual(["a"]);
  });

  // An index past the end appends rather than leaving a hole, which is what `splice` does and
  // what a caller clamping to "the end" expects.
  test("an index past the end appends", () => {
    expect(withSlotChild(parent({ items: ["a"] }), "items", "b", 9).slots?.items).toEqual([
      "a",
      "b",
    ]);
  });
});
