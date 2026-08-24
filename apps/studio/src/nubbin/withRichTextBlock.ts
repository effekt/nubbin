import type { RichText, RichTextBlock } from "@nubbin/core";

/** The document with one block replaced, as a new array. An index off the end changes
 * nothing. */
export function withRichTextBlock(doc: RichText, index: number, block: RichTextBlock): RichText {
  return doc.map((held, at) => (at === index ? block : held));
}
