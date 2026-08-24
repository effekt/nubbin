import type { RichText } from "@nubbin/core";
import { withRichTextBlock } from "./withRichTextBlock";

/** The document with one span removed from one block. Removing the last span leaves a
 * block with no text, which the schema allows and the author can still see and delete. */
export function withoutRichTextSpan(doc: RichText, blockIndex: number, span: number): RichText {
  const block = doc[blockIndex];
  if (block === undefined) return doc;
  return withRichTextBlock(doc, blockIndex, {
    ...block,
    spans: block.spans.filter((_, at) => at !== span),
  });
}
