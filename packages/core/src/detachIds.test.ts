import { describe, expect, test } from "vitest";
import { detachIds } from "./detachIds";
import type { DocumentVersion, Node } from "./document.types";

const node = (id: string, children?: string[]): Node => ({
  id,
  block: "Card",
  props: {},
  ...(children === undefined ? {} : { slots: { items: children } }),
});

const version = (): DocumentVersion => ({
  documentId: "d1",
  version: 1,
  roots: ["stack", "loose"],
  elements: { stack: node("stack", ["a", "b"]), a: node("a"), b: node("b"), loose: node("loose") },
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
});

describe("detachIds", () => {
  test("drops the ids from the slot that held them", () => {
    expect(detachIds(version(), new Set(["a"])).elements.stack?.slots?.items).toEqual(["b"]);
  });

  test("drops them from the roots", () => {
    expect(detachIds(version(), new Set(["loose"])).roots).toEqual(["stack"]);
  });

  test("leaves the elements themselves in place — detaching is not removing", () => {
    expect(detachIds(version(), new Set(["a"])).elements.a).toBeDefined();
  });

  test("leaves the input untouched", () => {
    const before = version();
    detachIds(before, new Set(["a"]));
    expect(before.elements.stack?.slots?.items).toEqual(["a", "b"]);
  });
});
