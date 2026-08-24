import type { RichText, RichTextSpan } from "@nubbin/core";
import { withRichTextBlock } from "./withRichTextBlock";

/** The document with one span of one block replaced. A missing block changes nothing. */
export function withRichTextSpan(
  doc: RichText,
  blockIndex: number,
  spanIndex: number,
  span: RichTextSpan,
): RichText {
  const block = doc[blockIndex];
  if (block === undefined) return doc;
  return withRichTextBlock(doc, blockIndex, {
    ...block,
    spans: block.spans.map((held, at) => (at === spanIndex ? span : held)),
  });
}
