import { describe, expect, test } from "vitest";
import type { Node } from "./document.types";
import { withoutSlotChildren } from "./withoutSlotChildren";

const parent = (slots: Record<string, string[]>): Node => ({
  id: "parent",
  block: "Stack",
  props: {},
  slots,
});

describe("withoutSlotChildren", () => {
  test("drops the named ids from the slot that held them", () => {
    const next = withoutSlotChildren(parent({ items: ["a", "b", "c"] }), new Set(["b"]));
    expect(next.slots?.items).toEqual(["a", "c"]);
  });

  test("drops from every slot, not only the first", () => {
    const next = withoutSlotChildren(parent({ l: ["a"], r: ["b"] }), new Set(["a", "b"]));
    expect(next.slots).toEqual({ l: [], r: [] });
  });

  test("keeps a slot that is left empty, because emptiness is compile's judgment", () => {
    expect(withoutSlotChildren(parent({ items: ["a"] }), new Set(["a"])).slots).toEqual({
      items: [],
    });
  });

  // Copy-on-write means untouched nodes stay untouched by reference, so a caller rebuilding a
  // document does not turn every sibling into a new object.
  test("returns the node itself when it held none of them", () => {
    const node = parent({ items: ["a"] });
    expect(withoutSlotChildren(node, new Set(["z"]))).toBe(node);
  });

  test("returns a node with no slots by reference", () => {
    const node: Node = { id: "leaf", block: "Card", props: {} };
    expect(withoutSlotChildren(node, new Set(["a"]))).toBe(node);
  });

  test("does not mutate the node it was given", () => {
    const node = parent({ items: ["a", "b"] });
    withoutSlotChildren(node, new Set(["a"]));
    expect(node.slots?.items).toEqual(["a", "b"]);
  });
});
