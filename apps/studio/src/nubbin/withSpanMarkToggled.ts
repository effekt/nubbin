import { RICH_TEXT_MARKS, type RichTextMark, type RichTextSpan } from "@nubbin/core";

/** The span with one mark toggled. Marks keep `core`'s own order however they were
 * toggled, so the same emphasis always serializes the same way, and a span whose last mark
 * left drops the key rather than carrying an empty array. */
export function withSpanMarkToggled(span: RichTextSpan, mark: RichTextMark): RichTextSpan {
  const held = span.marks ?? [];
  if (held.includes(mark)) {
    const next = held.filter((kept) => kept !== mark);
    if (next.length > 0) return { ...span, marks: next };
    const { marks: _dropped, ...rest } = span;
    return rest;
  }
  return { ...span, marks: RICH_TEXT_MARKS.filter((m) => m === mark || held.includes(m)) };
}
