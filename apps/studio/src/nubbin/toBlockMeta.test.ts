import { createRegistry, defineBlock, defineCatalog } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toBlockMeta } from "./toBlockMeta";

const heroSchema = z.object({ title: z.string() });

const registry = createRegistry([
  defineBlock({
    name: "Hero",
    category: "Heroes & Banners",
    schema: heroSchema,
    component: null,
    version: 1,
    slots: {},
  }),
]);

const catalog = defineCatalog({
  Hero: { schema: heroSchema, category: "Content" },
  Quote: { schema: heroSchema, category: "Social Proof" },
});

test("reads from the registry's block first", () => {
  expect(toBlockMeta(catalog, registry, "Hero", "category")).toBe("Heroes & Banners");
});

test("falls back to the catalog entry when the block omits the key", () => {
  expect(toBlockMeta(catalog, registry, "Quote", "category")).toBe("Social Proof");
});

test("answers undefined when neither half declares the key", () => {
  expect(toBlockMeta(catalog, registry, "Hero", "description")).toBeUndefined();
});
