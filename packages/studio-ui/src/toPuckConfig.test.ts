import { createRegistry, defineBlock } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toPuckConfig } from "./toPuckConfig";

const heroSchema = z.object({ eyebrow: z.string(), headline: z.string().max(80) });
const cardGridSchema = z.object({ heading: z.string() });
const cardSchema = z.object({ title: z.string() });
const blocks = [
  defineBlock({ name: "Hero", schema: heroSchema, component: null, version: 1, slots: {} }),
  defineBlock({
    name: "CardGrid",
    schema: cardGridSchema,
    component: null,
    version: 1,
    slots: { cards: { allow: ["Card"] } },
  }),
  defineBlock({ name: "Card", schema: cardSchema, component: null, version: 1, slots: {} }),
];
const catalog = {
  Hero: { schema: heroSchema },
  CardGrid: { schema: cardGridSchema },
  Card: { schema: cardSchema },
};
const registry = createRegistry(blocks);

test("one Puck component per catalog block", () => {
  const config = toPuckConfig(catalog, registry);
  expect(Object.keys(config.components).sort()).toEqual(Object.keys(catalog).sort());
});

test("the root carries the Page panel's whole meta field set", () => {
  const config = toPuckConfig(catalog, registry);
  expect(Object.keys(config.root?.fields ?? {})).toStrictEqual([
    "title",
    "description",
    "robots",
    "canonical",
  ]);
});

test("a constrained slot carries its allow list, and its scalars their controls", () => {
  const config = toPuckConfig(catalog, registry);
  const cardGrid = config.components.CardGrid;
  expect(cardGrid?.fields?.cards).toEqual({ type: "slot", allow: ["Card"] });
  const hero = config.components.Hero;
  // The headline's schema bounds its length, so it wears the bounded custom control.
  expect(hero?.fields?.headline).toMatchObject({ type: "custom" });
  expect(hero?.fields?.eyebrow).toMatchObject({ type: "text" });
});

test("a catalog block the registry does not hold stops the derivation by name", () => {
  const schema = z.object({ title: z.string() });
  const only = defineBlock({
    name: "Lonely",
    schema,
    component: null,
    version: 1,
    slots: {},
  });
  expect(() => toPuckConfig({ Missing: { schema } }, createRegistry([only]))).toThrow(/"Missing"/);
});
