import { describe, expect, test } from "vitest";
import type { DocumentVersion, Node } from "./document.types";
import { moveNode } from "./moveNode";

const node = (id: string, extra: Partial<Node> = {}): Node => ({
  id,
  block: "Card",
  props: {},
  ...extra,
});

const doc = (elements: Record<string, Node>, roots = ["stack"]): DocumentVersion => ({
  documentId: "d1",
  version: 1,
  roots,
  elements,
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
});

/** stack → [a, b, c]; aside is a second slot on stack */
const stack = () =>
  doc({
    stack: node("stack", { block: "Stack", slots: { sections: ["a", "b", "c"], aside: [] } }),
    a: node("a"),
    b: node("b"),
    c: node("c"),
  });

describe("moveNode", () => {
  test("moves a node between slots of the same parent", () => {
    const next = moveNode(stack(), "a", "stack", "aside");
    expect(next.elements.stack?.slots?.sections).toEqual(["b", "c"]);
    expect(next.elements.stack?.slots?.aside).toEqual(["a"]);
  });

  test("keeps the node itself — a move is a reference change, not a rewrite", () => {
    const before = stack();
    const next = moveNode(before, "a", "stack", "aside");
    expect(next.elements.a).toBe(before.elements.a);
  });

  // The index names a position in the slot as it stands *after* the node is taken out, which is
  // the only reading that lets "move it to the end" be the slot's length.
  test("reorders within one slot, indexing the slot as it stands after removal", () => {
    expect(moveNode(stack(), "a", "stack", "sections", 2).elements.stack?.slots?.sections).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  test("appends when given no index", () => {
    expect(moveNode(stack(), "a", "stack", "sections").elements.stack?.slots?.sections).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  test("moves a root into a slot, taking it out of the roots", () => {
    const two = doc({ stack: node("stack", { slots: { sections: [] } }), loose: node("loose") }, [
      "stack",
      "loose",
    ]);
    const next = moveNode(two, "loose", "stack", "sections");
    expect(next.roots).toEqual(["stack"]);
    expect(next.elements.stack?.slots?.sections).toEqual(["loose"]);
  });

  test("opens a slot the target parent has never filled", () => {
    const next = moveNode(stack(), "a", "stack", "unopened");
    expect(next.elements.stack?.slots?.unopened).toEqual(["a"]);
  });

  test("leaves the input untouched — every operation is copy-on-write", () => {
    const before = stack();
    moveNode(before, "a", "stack", "aside");
    expect(before.elements.stack?.slots?.sections).toEqual(["a", "b", "c"]);
    expect(before.elements.stack?.slots?.aside).toEqual([]);
  });

  test("refuses a node the document does not hold", () => {
    expect(() => moveNode(stack(), "ghost", "stack", "aside")).toThrow(/ghost/);
  });

  test("refuses a parent the document does not hold", () => {
    expect(() => moveNode(stack(), "a", "ghost", "aside")).toThrow(/ghost/);
  });

  // Moving a node inside its own subtree makes a cycle and detaches it from the roots — both of
  // which `compile` refuses by name. Judging it here would be a second opinion on the same
  // question, which is the division every operation in this package follows.
  test("does not judge a move into the node's own subtree", () => {
    const nested = doc({
      stack: node("stack", { slots: { sections: ["a"] } }),
      a: node("a", { slots: { items: ["a1"] } }),
      a1: node("a1"),
    });
    expect(() => moveNode(nested, "a", "a1", "items")).not.toThrow();
  });

  test("does not bump the document version", () => {
    expect(moveNode(stack(), "a", "stack", "aside").version).toBe(1);
  });
});
