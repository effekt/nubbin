import type { DocumentVersion } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { documentOutline } from "./documentOutline";

const version: DocumentVersion = {
  documentId: "d",
  version: 1,
  roots: ["stack"],
  elements: {
    stack: {
      id: "stack",
      block: "SectionStack",
      props: {},
      slots: { sections: ["hero", "split"] },
    },
    hero: { id: "hero", block: "Hero", props: {} },
    split: { id: "split", block: "Split", props: {}, slots: { start: ["grid"], end: [] } },
    grid: { id: "grid", block: "CardGrid", props: {}, slots: { cards: ["card"] } },
    card: { id: "card", block: "Card", props: {} },
  },
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
};

describe("documentOutline", () => {
  test("names every node by the id a write command addresses it with", () => {
    expect(documentOutline(version).join("\n")).toContain("stack  SectionStack");
    expect(documentOutline(version).join("\n")).toContain("card  Card");
  });

  test("nests a child deeper than its parent, so the shape is the indentation", () => {
    const lines = documentOutline(version);
    const stack = lines.find((line) => line.includes("stack  SectionStack")) ?? "";
    const card = lines.find((line) => line.includes("card  Card")) ?? "";
    expect(card.length - card.trimStart().length).toBeGreaterThan(
      stack.length - stack.trimStart().length,
    );
  });

  test("names the slot a child sits in, because that is the argument that moves it", () => {
    expect(documentOutline(version).join("\n")).toContain("sections");
    expect(documentOutline(version).join("\n")).toContain("start");
  });

  test("shows an empty slot rather than hiding it — it is a place a block can go", () => {
    expect(documentOutline(version).join("\n")).toMatch(/end\b/);
  });

  test("a document with no elements is one line, not an empty answer", () => {
    const empty = { ...version, roots: [], elements: {} };
    expect(documentOutline(empty)).toHaveLength(1);
  });
});
