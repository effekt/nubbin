import { describe, expect, test } from "vitest";
import { z } from "zod";
import { defineCatalog } from "./defineCatalog";

const heroSchema = z.object({ title: z.string(), price: z.number() });
const listSchema = z.object({ items: z.array(z.object({ heading: z.string() })) });

describe("defineCatalog", () => {
  test("keeps entries addressable by block name", () => {
    const catalog = defineCatalog({ Hero: { schema: heroSchema } });
    expect(catalog.Hero?.schema).toBe(heroSchema);
  });

  test("passes a description through untouched, and leaves an omitted one absent", () => {
    const catalog = defineCatalog({
      Hero: { schema: heroSchema, description: "The opening statement of a page." },
      List: { schema: listSchema },
    });
    expect(catalog.Hero?.description).toBe("The opening statement of a page.");
    expect(catalog.List?.description).toBeUndefined();
  });

  test("passes icon, docs links and category through untouched, and leaves omitted ones absent", () => {
    const catalog = defineCatalog({
      Hero: {
        schema: heroSchema,
        icon: "🖼",
        category: "Heroes & Banners",
        docs: { figma: "https://example.com/figma/hero" },
      },
      List: { schema: listSchema },
    });
    expect(catalog.Hero?.icon).toBe("🖼");
    expect(catalog.Hero?.category).toBe("Heroes & Banners");
    expect(catalog.Hero?.docs).toEqual({ figma: "https://example.com/figma/hero" });
    expect(catalog.List?.icon).toBeUndefined();
    expect(catalog.List?.category).toBeUndefined();
    expect(catalog.List?.docs).toBeUndefined();
  });

  test("fails registration when a ui hint names a field the schema lacks", () => {
    expect(() =>
      defineCatalog({ Hero: { schema: heroSchema, ui: { fields: { subtitle: {} } } } }),
    ).toThrow(/subtitle/);
  });

  test("fails registration when defaults do not satisfy the schema", () => {
    expect(() =>
      defineCatalog({ Hero: { schema: heroSchema, defaults: { title: "Hi" } } }),
    ).toThrow(/price/);
  });

  test("fails registration when a data hint addresses an array-member path", () => {
    expect(() =>
      defineCatalog({
        List: {
          schema: listSchema,
          ui: { fields: { "items[].heading": { data: { revalidate: 60 } } } },
        },
      }),
    ).toThrow(/List.*items\[\]\.heading/s);
  });

  test("passes a control hint through untouched, on a top-level and an array-member path", () => {
    const catalog = defineCatalog({
      Hero: { schema: heroSchema, ui: { fields: { title: { control: "link" } } } },
      List: { schema: listSchema, ui: { fields: { "items[].heading": { control: "link" } } } },
    });
    expect(catalog.Hero?.ui?.fields?.title?.control).toBe("link");
    expect(catalog.List?.ui?.fields?.["items[].heading"]?.control).toBe("link");
  });

  test("fails registration when a control hint names a field the schema lacks", () => {
    expect(() =>
      defineCatalog({
        Hero: { schema: heroSchema, ui: { fields: { url: { control: "link" } } } },
      }),
    ).toThrow(/url/);
  });

  test("keeps a hint on an array-member path legal", () => {
    expect(() =>
      defineCatalog({
        List: { schema: listSchema, ui: { fields: { "items[].heading": {} } } },
      }),
    ).not.toThrow();
  });
});
