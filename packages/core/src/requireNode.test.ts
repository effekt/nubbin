import { describe, expect, test } from "vitest";
import type { DocumentVersion } from "./document.types";
import { requireNode } from "./requireNode";

const version: DocumentVersion = {
  documentId: "d1",
  version: 1,
  roots: ["a"],
  elements: { a: { id: "a", block: "Card", props: {} } },
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
};

describe("requireNode", () => {
  test("returns the node the document holds", () => {
    expect(requireNode(version, "a")).toBe(version.elements.a);
  });

  test("names the node and the document when it holds none", () => {
    expect(() => requireNode(version, "ghost")).toThrow(/no node "ghost" in document "d1"/);
  });
});
