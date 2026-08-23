import { describe, expect, test } from "vitest";
import type { Node } from "./document.types";
import { idsReachableFrom } from "./idsReachableFrom";

const node = (id: string, children?: string[]): Node => ({
  id,
  block: "Card",
  props: {},
  ...(children === undefined ? {} : { slots: { items: children } }),
});

const elements = (...nodes: Node[]): Record<string, Node> =>
  Object.fromEntries(nodes.map((entry) => [entry.id, entry]));

describe("idsReachableFrom", () => {
  test("a leaf has none", () => {
    expect(idsReachableFrom(elements(node("a")), ["a"])).toEqual(new Set());
  });

  test("collects children, grandchildren and deeper", () => {
    const held = elements(node("a", ["b"]), node("b", ["c"]), node("c", ["d"]), node("d"));
    expect(idsReachableFrom(held, ["a"])).toEqual(new Set(["b", "c", "d"]));
  });

  test("collects across sibling slots, not only the first", () => {
    const parent: Node = { id: "a", block: "Card", props: {}, slots: { l: ["b"], r: ["c"] } };
    expect(idsReachableFrom(elements(parent, node("b"), node("c")), ["a"])).toEqual(
      new Set(["b", "c"]),
    );
  });

  test("names an id no element backs, because a slot may reference one", () => {
    expect(idsReachableFrom(elements(node("a", ["ghost"])), ["a"])).toEqual(new Set(["ghost"]));
  });

  // `validateStructure` refuses a cycle, but it runs at compile — and a document is free to be
  // illegal between two edits. A walk with no visited set would not return from one.
  test("returns from a cycle rather than walking it forever", () => {
    const held = elements(node("a", ["b"]), node("b", ["a"]));
    expect(idsReachableFrom(held, ["a"])).toEqual(new Set(["b", "a"]));
  });
});
