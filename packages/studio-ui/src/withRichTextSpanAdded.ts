import type { RichText } from "@nubbin/core";
import { withRichTextBlock } from "./withRichTextBlock";

/** The document with an empty span inserted after the given index in one block — the seat
 * for a run whose marks will differ from its neighbours'. */
export function withRichTextSpanAdded(doc: RichText, blockIndex: number, after: number): RichText {
  const block = doc[blockIndex];
  if (block === undefined) return doc;
  const spans = [...block.spans];
  spans.splice(after + 1, 0, { text: "" });
  return withRichTextBlock(doc, blockIndex, { ...block, spans });
}
