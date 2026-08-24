import type { Node } from "@nubbin/core";
import { cardDefaults } from "demo/src/blocks/cardDefaults";
import { heroDefaults } from "demo/src/blocks/heroDefaults";
import { catalog } from "demo/src/nubbin/catalog";
import { registry } from "demo/src/nubbin/registry";
import { expect, test } from "vitest";
import { previewNode } from "./previewNode";

const build = (block: string, depth = 3) => {
  const elements: Record<string, Node> = {};
  const root = previewNode(block, catalog, registry, elements, depth);
  return { root, elements };
};

test("a slotless block becomes one node carrying its defaults", () => {
  const { root, elements } = build("Hero");
  expect(Object.keys(elements)).toEqual([root]);
  expect(elements[root]?.props).toEqual(heroDefaults);
  expect(elements[root]?.slots).toBeUndefined();
});

test("a min-bound allow-listed slot is inhabited by that block's own defaults", () => {
  const { root, elements } = build("CardGrid");
  const cards = elements[root]?.slots?.cards;
  expect(cards).toHaveLength(1);
  const card = elements[cards?.[0] ?? ""];
  expect(card?.block).toBe("Card");
  expect(card?.props).toEqual(cardDefaults);
});

test("a block with two required slots fills both, each from its shared allow list", () => {
  const { root, elements } = build("Split");
  for (const slot of ["start", "end"]) {
    const children = elements[root]?.slots?.[slot];
    expect(children).toHaveLength(1);
    expect(elements[children?.[0] ?? ""]?.block).toBe("Prose");
  }
});

test("an open required slot falls back to the first registered block", () => {
  const { root, elements } = build("SectionStack");
  const sections = elements[root]?.slots?.sections ?? [];
  expect(sections).toHaveLength(1);
  expect(elements[sections[0] ?? ""]?.block).toBe(registry.names()[0]);
});

test("the same block builds the same document twice — ids included", () => {
  expect(build("Split")).toEqual(build("Split"));
});

test("depth zero stops the fill instead of recursing", () => {
  const { root, elements } = build("CardGrid", 0);
  expect(elements[root]?.slots).toBeUndefined();
  expect(Object.keys(elements)).toHaveLength(1);
});
