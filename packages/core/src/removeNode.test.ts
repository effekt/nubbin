import { describe, expect, test } from "vitest";
import type { DocumentVersion, Node } from "./document.types";
import { removeNode } from "./removeNode";

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

/** stack → [a, b]; a → [a1, a2]; a1 → [deep] */
const nested = () =>
  doc({
    stack: node("stack", { block: "Stack", slots: { sections: ["a", "b"] } }),
    a: node("a", { slots: { items: ["a1", "a2"] } }),
    a1: node("a1", { slots: { items: ["deep"] } }),
    a2: node("a2"),
    deep: node("deep"),
    b: node("b"),
  });

describe("removeNode", () => {
  test("takes the node out of its parent's slot", () => {
    expect(removeNode(nested(), "b").elements.stack?.slots?.sections).toEqual(["a"]);
  });

  test("takes the node out of the elements", () => {
    expect(removeNode(nested(), "b").elements.b).toBeUndefined();
  });

  // Removing a section means removing what was in it. Left behind, the children would be
  // unreachable — which `compile` already refuses — so the alternative to cascading is a
  // document that cannot compile until the author deletes each orphan by hand.
  test("cascades to every descendant, however deep", () => {
    const next = removeNode(nested(), "a");
    for (const id of ["a", "a1", "a2", "deep"]) {
      expect(next.elements[id], `${id} should be gone`).toBeUndefined();
    }
    expect(next.elements.b).toBeDefined();
  });

  test("removing a root takes it out of the roots", () => {
    const next = removeNode(nested(), "stack");
    expect(next.roots).toEqual([]);
    expect(next.elements).toEqual({});
  });

  test("leaves the input untouched — every operation is copy-on-write", () => {
    const before = nested();
    removeNode(before, "a");
    expect(before.elements.deep).toBeDefined();
    expect(before.elements.stack?.slots?.sections).toEqual(["a", "b"]);
  });

  test("refuses a node the document does not hold", () => {
    expect(() => removeNode(nested(), "ghost")).toThrow(/ghost/);
  });

  // A slot emptied below its `min` is `compile`'s judgment, as it is for every other operation.
  test("does not judge whether the slot it emptied is still legal", () => {
    const next = removeNode(removeNode(nested(), "a"), "b");
    expect(next.elements.stack?.slots?.sections).toEqual([]);
  });

  test("does not bump the document version", () => {
    expect(removeNode(nested(), "b").version).toBe(1);
  });
});
