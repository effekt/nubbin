import { createRegistry, defineBlock, defineCatalog } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toPaletteBlock } from "./toPaletteBlock";

const heroSchema = z.object({ title: z.string() });

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
  defineBlock({ name: "Quote", schema: heroSchema, component: null, version: 1, slots: {} }),
]);

const catalog = defineCatalog({
  Hero: { schema: heroSchema },
  Quote: { schema: heroSchema, description: "Someone's words, attributed.", icon: "❝" },
});

test("carries the name with the block's own description and icon", () => {
  expect(toPaletteBlock(catalog, registry, "Hero")).toEqual({
    name: "Hero",
    description: "The opening statement of a page.",
    icon: "🖼",
  });
});

test("falls back to the catalog entry's description and icon", () => {
  expect(toPaletteBlock(catalog, registry, "Quote")).toEqual({
    name: "Quote",
    description: "Someone's words, attributed.",
    icon: "❝",
  });
});
