import type { RichText } from "@nubbin/core";

/** The document with one block removed, as a new array. */
export function withoutRichTextBlock(doc: RichText, index: number): RichText {
  return doc.filter((_, at) => at !== index);
}
