import { describe, expect, test } from "vitest";
import type { DocumentVersion, Node } from "./document.types";
import { withElements } from "./withElements";

const node = (id: string, props: Record<string, unknown> = {}): Node => ({
  id,
  block: "Card",
  props,
});

const version = (): DocumentVersion => ({
  documentId: "d1",
  version: 1,
  roots: ["a"],
  elements: { a: node("a"), b: node("b") },
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
});

describe("withElements", () => {
  test("writes one node over the id it carries", () => {
    const next = withElements(version(), node("a", { edited: true }));
    expect(next.elements.a?.props).toEqual({ edited: true });
  });

  test("writes several in one pass, which is what adding a node beside its parent needs", () => {
    const next = withElements(version(), node("a", { edited: true }), node("c"));
    expect(next.elements.a?.props).toEqual({ edited: true });
    expect(next.elements.c).toBeDefined();
  });

  test("leaves every other node untouched by reference", () => {
    const before = version();
    expect(withElements(before, node("a", { edited: true })).elements.b).toBe(before.elements.b);
  });

  test("leaves the input untouched", () => {
    const before = version();
    withElements(before, node("a", { edited: true }));
    expect(before.elements.a?.props).toEqual({});
  });

  test("changes nothing else about the document", () => {
    const next = withElements(version(), node("a", { edited: true }));
    expect(next.roots).toEqual(["a"]);
    expect(next.version).toBe(1);
  });
});
