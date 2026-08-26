import { type FieldNode, richText, zodAdapter } from "@nubbin/core";

/** What `zodAdapter.describe` reports beneath a `richText()` field, rooted at the array
 * itself — every path starts `[]`. The projection carries no marker for rich text, so this
 * described shape is the identity a candidate field is compared against, and it moves with
 * `core`'s own constants: a mark added there arrives here without an edit. */
export const richTextFieldNodes: readonly FieldNode[] = zodAdapter.describe(richText());
