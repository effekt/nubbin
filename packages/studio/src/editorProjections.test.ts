import { createRegistry, defineBlock, defineCatalog } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toDocsByBlock } from "./toDocsByBlock";
import { toSlotConstraintsByBlock } from "./toSlotConstraintsByBlock";
import { toSlotNamesByBlock } from "./toSlotNamesByBlock";

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
  defineBlock({
    name: "Stack",
    schema: stackSchema,
    component: null,
    version: 1,
    slots: { children: { max: 12 } },
  }),
]);

test("projects documentation from blocks before catalog entries", () => {
  const catalog = defineCatalog({
    Hero: { schema: heroSchema },
    Stack: { schema: stackSchema, docs: { storybook: "https://example.com/stack" } },
  });
  expect(toDocsByBlock(catalog, registry)).toEqual({
    Hero: { figma: "https://example.com/figma/hero" },
    Stack: { storybook: "https://example.com/stack" },
  });
});

test("projects slot names and constraints for every registered block", () => {
  expect(toSlotNamesByBlock(registry)).toEqual({ Hero: [], Stack: ["children"] });
  expect(toSlotConstraintsByBlock(registry)).toEqual({
    Hero: {},
    Stack: { children: { max: 12 } },
  });
});
