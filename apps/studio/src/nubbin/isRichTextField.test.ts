import { richText, zodAdapter } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { isRichTextField } from "./isRichTextField";

const JSON_SCHEMA = richText()["~standard"].jsonSchema.input({ target: "draft-2020-12" });

/** The demo's seating: zod holds the seat, `core`'s JSON Schema is the description. */
const seated = z.object({ heading: z.string(), body: z.unknown().meta(JSON_SCHEMA) });

const fieldAt = (fields: ReturnType<typeof zodAdapter.describe>, path: string) => {
  const found = fields.find((node) => node.path === path);
  if (found === undefined) throw new Error(`no field at ${path}`);
  return found;
};

test("a richText() field seated in zod is recognised by its described shape", () => {
  const fields = zodAdapter.describe(seated);
  expect(isRichTextField(fieldAt(fields, "body"), fields)).toBe(true);
});

test("an ordinary array of objects is not rich text", () => {
  const fields = zodAdapter.describe(
    z.object({ items: z.array(z.object({ title: z.string(), href: z.string() })) }),
  );
  expect(isRichTextField(fieldAt(fields, "items"), fields)).toBe(false);
});

test("a near-miss stays an ordinary array — an extra span field", () => {
  const fields = zodAdapter.describe(
    z.object({
      body: z.array(
        z.object({
          kind: z.enum(["paragraph", "listItem"]),
          spans: z.array(
            z.object({
              text: z.string(),
              marks: z.array(z.enum(["strong", "em", "code"])).optional(),
              href: z.string().optional(),
              color: z.string().optional(),
            }),
          ),
        }),
      ),
    }),
  );
  expect(isRichTextField(fieldAt(fields, "body"), fields)).toBe(false);
});

test("a near-miss stays an ordinary array — a different mark set", () => {
  const fields = zodAdapter.describe(
    z.object({
      body: z.array(
        z.object({
          kind: z.enum(["paragraph", "listItem"]),
          spans: z.array(
            z.object({
              text: z.string(),
              marks: z.array(z.enum(["strong", "em", "blink"])).optional(),
              href: z.string().optional(),
            }),
          ),
        }),
      ),
    }),
  );
  expect(isRichTextField(fieldAt(fields, "body"), fields)).toBe(false);
});

test("an exact structural twin written by hand is rich text — the shape is the identity", () => {
  const fields = zodAdapter.describe(
    z.object({
      body: z.array(
        z.object({
          kind: z.enum(["paragraph", "listItem"]),
          spans: z.array(
            z.object({
              text: z.string(),
              marks: z.array(z.enum(["strong", "em", "code"])).optional(),
              href: z.string().optional(),
            }),
          ),
        }),
      ),
    }),
  );
  expect(isRichTextField(fieldAt(fields, "body"), fields)).toBe(true);
});

test("a non-array field is never rich text", () => {
  const fields = zodAdapter.describe(seated);
  expect(isRichTextField(fieldAt(fields, "heading"), fields)).toBe(false);
});
