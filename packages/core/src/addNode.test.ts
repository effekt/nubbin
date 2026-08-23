import { describe, expect, test } from "vitest";
import { addNode } from "./addNode";
import type { DocumentVersion, Node } from "./document.types";

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

const stack = () =>
  doc({
    stack: node("stack", { block: "Stack", slots: { sections: ["a", "b"] } }),
    a: node("a"),
    b: node("b"),
  });

describe("addNode", () => {
  test("places the node in the slot and registers it among the elements", () => {
    const next = addNode(stack(), "stack", "sections", node("c"));
    expect(next.elements.stack?.slots?.sections).toEqual(["a", "b", "c"]);
    expect(next.elements.c).toEqual(node("c"));
  });

  test("places at an index when given one, so an author can insert rather than append", () => {
    const next = addNode(stack(), "stack", "sections", node("c"), 1);
    expect(next.elements.stack?.slots?.sections).toEqual(["a", "c", "b"]);
  });

  test("opens a slot the parent has never filled", () => {
    const next = addNode(stack(), "stack", "aside", node("c"));
    expect(next.elements.stack?.slots?.aside).toEqual(["c"]);
    expect(next.elements.stack?.slots?.sections).toEqual(["a", "b"]);
  });

  test("leaves the input untouched — every operation is copy-on-write", () => {
    const before = stack();
    addNode(before, "stack", "sections", node("c"));
    expect(before.elements.stack?.slots?.sections).toEqual(["a", "b"]);
    expect(before.elements.c).toBeUndefined();
  });

  test("refuses a parent the document does not hold", () => {
    expect(() => addNode(stack(), "ghost", "sections", node("c"))).toThrow(/ghost/);
  });

  // An id already in use would silently replace the node that holds it, and every slot
  // referencing the old one would now point at the new. The caller mints ids, so this is the
  // only place that can tell it the mint collided.
  test("refuses an id the document already uses", () => {
    expect(() => addNode(stack(), "stack", "sections", node("a"))).toThrow(/"a"/);
  });

  // Slot legality — `allow`, `min`, `max` — is `compile`'s judgment, the same division
  // `setNodeProp` follows for prop validity. A document may be illegal between edits.
  test("does not judge whether the block belongs in the slot", () => {
    const next = addNode(stack(), "stack", "sections", node("c", { block: "Anything" }));
    expect(next.elements.c?.block).toBe("Anything");
  });

  test("does not bump the document version", () => {
    expect(addNode(stack(), "stack", "sections", node("c")).version).toBe(1);
  });
});
