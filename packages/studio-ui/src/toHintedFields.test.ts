import { zodAdapter } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { toHintedFields } from "./toHintedFields";

const schema = z.object({
  headline: z.string(),
  cta: z.object({ label: z.string(), href: z.string() }),
  items: z.array(z.object({ imageUrl: z.string() })),
});

describe("toHintedFields", () => {
  test("folds a control hint onto the node its path names, nested paths included", () => {
    const fields = toHintedFields(zodAdapter.describe(schema), {
      fields: { "cta.href": { control: "link" }, "items[].imageUrl": { control: "link" } },
    });
    expect(fields.find((f) => f.path === "cta.href")?.control).toBe("link");
    expect(fields.find((f) => f.path === "items[].imageUrl")?.control).toBe("link");
  });

  test("leaves unhinted paths untouched, and a data-only hint sets no control", () => {
    const fields = toHintedFields(zodAdapter.describe(schema), {
      fields: { items: { data: { revalidate: 5 } } },
    });
    expect(fields.every((f) => f.control === undefined)).toBe(true);
  });

  test("passes every node through unchanged when the block carries no ui", () => {
    const described = zodAdapter.describe(schema);
    expect(toHintedFields(described, undefined)).toEqual(described);
  });
});
