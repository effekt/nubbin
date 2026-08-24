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
]);

const catalog = defineCatalog({
  Hero: { schema: heroSchema },
  Stack: { schema: stackSchema, description: "Stacks its children top to bottom.", icon: "🧱" },
});

test("groups blocks by the derived categories, content before layout", () => {
  const groups = toPaletteGroups(catalog, registry);
  expect(groups.map((group) => group.title)).toEqual(["Content", "Layout"]);
  expect(groups[0]?.blocks.map((block) => block.name)).toEqual(["Hero"]);
  expect(groups[1]?.blocks.map((block) => block.name)).toEqual(["Stack"]);
});

test("reads a description from the block first, the catalog entry second", () => {
  const groups = toPaletteGroups(catalog, registry);
  expect(groups[0]?.blocks[0]?.description).toBe("The opening statement of a page.");
  expect(groups[1]?.blocks[0]?.description).toBe("Stacks its children top to bottom.");
});

test("reads an icon from the block first, the catalog entry second", () => {
  const groups = toPaletteGroups(catalog, registry);
  expect(groups[0]?.blocks[0]?.icon).toBe("🖼");
  expect(groups[1]?.blocks[0]?.icon).toBe("🧱");
});
