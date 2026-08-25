import type { CatalogEntry } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toFieldLabel } from "./toFieldLabel";

const entry: CatalogEntry = {
  schema: z.object({
    headline: z.string(),
    cta: z.object({ label: z.string() }),
    items: z.array(z.object({ title: z.string() })),
  }),
};

test("a described path is humanized", () => {
  expect(toFieldLabel("headline", entry)).toBe("Headline");
  expect(toFieldLabel("cta.label", entry)).toBe("Cta label");
});

test("an array member path resolves through the [] the description uses", () => {
  expect(toFieldLabel("items.0.title", entry)).toBe("Items 0 title");
});

test("a slot path names the slot without needing the schema", () => {
  expect(toFieldLabel("slots.sections", undefined)).toBe("Sections");
});

test("a path the schema does not describe falls back to itself, raw", () => {
  expect(toFieldLabel("mystery.knob", entry)).toBe("mystery.knob");
});

test("a path with no catalog entry falls back to itself, raw", () => {
  expect(toFieldLabel("headline", undefined)).toBe("headline");
});

test("an empty or absent path is no label at all", () => {
  expect(toFieldLabel("", entry)).toBeUndefined();
  expect(toFieldLabel(undefined, entry)).toBeUndefined();
});
