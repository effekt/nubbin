import { createRegistry, defineBlock, defineCatalog } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toPaletteGroups } from "./toPaletteGroups";

const heroSchema = z.object({ title: z.string() });
const stackSchema = z.object({});

const registry = createRegistry([
  defineBlock({
    name: "Hero",
    description: "The opening statement of a page.",
    icon: "🖼",
    category: "Heroes & Banners",
    schema: heroSchema,
    component: null,
    version: 1,
    slots: {},
  }),
  defineBlock({
    name: "Quote",
    category: "Social Proof",
    schema: heroSchema,
    component: null,
    version: 1,
    slots: {},
  }),
  defineBlock({
    name: "Stack",
    schema: stackSchema,
    component: null,
    version: 1,
    slots: { sections: {} },
  }),
  defineBlock({ name: "Prose", schema: heroSchema, component: null, version: 1, slots: {} }),
]);

const catalog = defineCatalog({
  Hero: { schema: heroSchema },
  Quote: { schema: heroSchema },
  Stack: { schema: stackSchema, description: "Stacks its children top to bottom.", icon: "🧱" },
  Prose: { schema: heroSchema },
});

test("groups blocks under their declared categories, in catalog registration order", () => {
  const groups = toPaletteGroups(catalog, registry);
  expect(groups.map((group) => group.title)).toEqual([
    "Heroes & Banners",
    "Social Proof",
    "Layout",
    "Content",
  ]);
});

test("a block declaring no category files under the derived fallback, after declared groups", () => {
  const groups = toPaletteGroups(catalog, registry);
  expect(groups[2]?.blocks.map((block) => block.name)).toEqual(["Stack"]);
  expect(groups[3]?.blocks.map((block) => block.name)).toEqual(["Prose"]);
});

test("a derived fallback matching a declared title joins that group rather than doubling it", () => {
  const merged = defineCatalog({
    Stack: { schema: stackSchema, category: "Content" },
    Prose: { schema: heroSchema },
  });
  const groups = toPaletteGroups(merged, registry);
  const titles = groups.map((group) => group.title);
  expect(titles).toEqual([...new Set(titles)]);
  expect(groups.find((group) => group.title === "Content")?.blocks.map((b) => b.name)).toEqual([
    "Stack",
    "Prose",
  ]);
});

test("a catalog category counts when the registry's block declares none", () => {
  const catalogOnly = defineCatalog({
    Prose: { schema: heroSchema, category: "Content" },
  });
  const groups = toPaletteGroups(catalogOnly, registry);
  expect(groups.map((group) => group.title)).toEqual(["Content"]);
});

test("reads a description from the block first, the catalog entry second", () => {
  const groups = toPaletteGroups(catalog, registry);
  expect(groups[0]?.blocks[0]?.description).toBe("The opening statement of a page.");
  expect(groups[2]?.blocks[0]?.description).toBe("Stacks its children top to bottom.");
});

test("reads an icon from the block first, the catalog entry second", () => {
  const groups = toPaletteGroups(catalog, registry);
  expect(groups[0]?.blocks[0]?.icon).toBe("🖼");
  expect(groups[2]?.blocks[0]?.icon).toBe("🧱");
});
