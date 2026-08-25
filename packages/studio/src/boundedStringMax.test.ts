import { expect, test } from "vitest";
import { z } from "zod";
import { boundedStringMax } from "./boundedStringMax";

const entry = {
  schema: z.object({
    headline: z.string().max(60),
    body: z.string(),
    count: z.number().max(9),
    items: z.array(z.object({ title: z.string().max(12) })),
  }),
};

test("a bounded string answers its schema's own maximum", () => {
  expect(boundedStringMax("headline", entry)).toBe(60);
});

test("an array member's path resolves through the [] form the description uses", () => {
  expect(boundedStringMax("items.0.title", entry)).toBe(12);
});

test("an unbounded string, a non-string, and an unknown path answer undefined", () => {
  expect(boundedStringMax("body", entry)).toBeUndefined();
  expect(boundedStringMax("count", entry)).toBeUndefined();
  expect(boundedStringMax("missing", entry)).toBeUndefined();
});

test("no path or no entry answers undefined", () => {
  expect(boundedStringMax(undefined, entry)).toBeUndefined();
  expect(boundedStringMax("", entry)).toBeUndefined();
  expect(boundedStringMax("headline", undefined)).toBeUndefined();
});
