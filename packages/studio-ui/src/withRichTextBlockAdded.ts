import type { RichText, RichTextBlockKind } from "@nubbin/core";

/** The document with a fresh block of the given kind appended, holding one empty span so
 * the author lands in a place to type. */
export function withRichTextBlockAdded(doc: RichText, kind: RichTextBlockKind): RichText {
  return [...doc, { kind, spans: [{ text: "" }] }];
}
