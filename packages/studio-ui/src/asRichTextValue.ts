import { type RichText, richText } from "@nubbin/core";

/** The value as `core`'s rich text when it validates as one — `undefined` reads as the
 * empty document a fresh field holds — and `undefined` when it does not, so the control
 * edits only what the type models and shows anything else as it found it. */
export function asRichTextValue(value: unknown): RichText | undefined {
  if (value === undefined) return [];
  const result = richText()["~standard"].validate(value);
  return result.issues === undefined ? result.value : undefined;
}
