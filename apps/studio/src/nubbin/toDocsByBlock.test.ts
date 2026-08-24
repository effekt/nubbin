import { createRegistry, defineBlock, defineCatalog } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toDocsByBlock } from "./toDocsByBlock";

const heroSchema = z.object({ title: z.string() });
const stackSchema = z.object({});

const registry = createRegistry([
  defineBlock({
    name: "Hero",
    docs: { figma: "https://example.com/figma/hero" },
    schema: heroSchema,
    component: null,
    version: 1,
    slots: {},
  }),
  defineBlock({ name: "Stack", schema: stackSchema, component: null, version: 1, slots: {} }),
]);

test("reads docs from the block first, the catalog entry second", () => {
  const catalog = defineCatalog({
    Hero: { schema: heroSchema },
    Stack: { schema: stackSchema, docs: { storybook: "https://example.com/sb/stack" } },
  });
  expect(toDocsByBlock(catalog, registry)).toEqual({
    Hero: { figma: "https://example.com/figma/hero" },
    Stack: { storybook: "https://example.com/sb/stack" },
  });
});

test("leaves a block declaring no docs absent", () => {
  const catalog = defineCatalog({ Hero: { schema: heroSchema }, Stack: { schema: stackSchema } });
  expect(toDocsByBlock(catalog, registry)).toEqual({
    Hero: { figma: "https://example.com/figma/hero" },
  });
});
