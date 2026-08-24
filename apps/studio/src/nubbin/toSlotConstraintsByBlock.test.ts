import { createRegistry, defineBlock } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toSlotConstraintsByBlock } from "./toSlotConstraintsByBlock";

const registry = createRegistry([
  defineBlock({
    name: "Stack",
    schema: z.object({ gap: z.string() }),
    component: null,
    version: 1,
    slots: { children: { max: 12 } },
  }),
  defineBlock({
    name: "Hero",
    schema: z.object({ title: z.string() }),
    component: null,
    version: 1,
    slots: {},
  }),
]);

test("keys each block's declared slots and constraints by block name", () => {
  const slots = toSlotConstraintsByBlock(registry);
  expect(slots.Stack?.children?.max).toBe(12);
  expect(slots.Hero).toEqual({});
});
