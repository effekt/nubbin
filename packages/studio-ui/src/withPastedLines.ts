import type { RichText } from "@nubbin/core";
import { withRichTextSpan } from "./withRichTextSpan";

/** The document after a multi-line paste into one span: the first line replaces the span's
 * selection, and every further line becomes its own paragraph after the span's block. The
 * lines are already plain text, so nothing unmodeled can ride in. */
export function withPastedLines(
  doc: RichText,
  blockIndex: number,
  spanIndex: number,
  range: { start: number; end: number },
  lines: readonly string[],
): RichText {
  const [first, ...rest] = lines;
  const span = doc[blockIndex]?.spans[spanIndex];
  if (span === undefined || first === undefined) return doc;
  const text = span.text.slice(0, range.start) + first + span.text.slice(range.end);
  const spliced = withRichTextSpan(doc, blockIndex, spanIndex, { ...span, text });
  const added = rest.map((line) => ({ kind: "paragraph" as const, spans: [{ text: line }] }));
  return [...spliced.slice(0, blockIndex + 1), ...added, ...spliced.slice(blockIndex + 1)];
}
