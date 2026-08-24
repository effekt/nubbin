import type { RichText } from "./richText.types";
import { richTextSchema } from "./richTextSchema";
import type { StandardDataSchema } from "./standardDataSchema.types";

// A call rather than a bare value, so a field declaration reads the way the rest of a block's
// schema does and so options can arrive without changing call sites that pass none. A scan for
// this call finds every rich-text field in a registry.
/**
 * The schema for a rich-text field: an ordered array of blocks, each an ordered array of spans,
 * over closed mark and kind sets. Declare it as a block's field to give an author inline
 * emphasis and links without giving anyone markup.
 *
 * Nothing in the value is parsed or evaluated at render, so an artifact carrying one is as inert
 * as an artifact carrying a string. Both sets and both object shapes are closed: a key the shape
 * does not declare is reported, never dropped.
 *
 * @returns The rich-text schema — a `StandardDataSchema<RichText>` whose `~standard.validate` is
 *   synchronous and whose `~standard.jsonSchema` converter is always present. Every call yields
 *   the same value, so a registry keyed by schema identity sees one schema across every field
 *   that declares it.
 * @example
 * ```ts
 * const schema = richText();
 *
 * const body: RichText = [
 *   {
 *     kind: "paragraph",
 *     spans: [
 *       { text: "How we keep that safe is on our " },
 *       { text: "security page", href: "/security" },
 *       { text: ", not in a PDF.", marks: ["strong", "em"] },
 *     ],
 *   },
 *   { kind: "listItem", spans: [{ text: "encrypted", marks: ["code"] }] },
 * ];
 *
 * schema["~standard"].validate(body).issues; // undefined
 *
 * // A refusal names the offending path rather than throwing.
 * schema["~standard"].validate([{ kind: "heading", spans: [] }]).issues;
 * // [{ path: [0, "kind"], message: 'unknown kind "heading"; expected one of paragraph, listItem' }]
 * ```
 * @example
 * Seating it in a validator that will not hold a foreign schema — zod rejects one inside an
 * object shape, so the field is carried as `unknown` and `core` decides what is valid:
 * ```ts
 * const spec = richText();
 *
 * const body = z
 *   .unknown()
 *   .check((ctx) => {
 *     for (const issue of spec["~standard"].validate(ctx.value).issues ?? []) {
 *       ctx.issues.push({ code: "custom", message: issue.message, input: ctx.value });
 *     }
 *   })
 *   .pipe(z.custom<RichText>())
 *   .meta(spec["~standard"].jsonSchema.input({ target: "draft-2020-12" }));
 * ```
 */
export function richText(): StandardDataSchema<RichText> {
  return richTextSchema;
}
