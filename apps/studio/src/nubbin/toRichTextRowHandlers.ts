import type { RichText, RichTextBlockKind, RichTextSpan } from "@nubbin/core";
import type { RichTextSelection } from "../components/richTextSelection.types";
import { withItemMoved } from "./withItemMoved";
import { withoutRichTextBlock } from "./withoutRichTextBlock";
import { withoutRichTextSpan } from "./withoutRichTextSpan";
import { withPastedLines } from "./withPastedLines";
import { withRichTextBlock } from "./withRichTextBlock";
import { withRichTextSpan } from "./withRichTextSpan";
import { withRichTextSpanAdded } from "./withRichTextSpanAdded";

/** Everything one block row can do to the document, each op a pure edit. */
export interface RichTextRowHandlers {
  onKind: (kind: RichTextBlockKind) => void;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  onSelectSpan: (span: number) => void;
  onSpanChange: (span: number, next: RichTextSpan) => void;
  onSpanRemove: (span: number) => void;
  onSpanAdd: (after: number) => void;
  onPaste: (span: number, range: { start: number; end: number }, lines: string[]) => void;
}

/** One block row's handlers, each folding a pure edit of the typed document into the
 * field's own change — so every path out of the control is structure, never markup. The
 * ops that move or remove what the selection points at clear it rather than let it dangle. */
export function toRichTextRowHandlers(
  doc: RichText,
  index: number,
  onChange: (next: RichText) => void,
  onSelect: (selection: RichTextSelection | undefined) => void,
): RichTextRowHandlers {
  const block = doc[index];
  return {
    onKind: (kind) => {
      if (block !== undefined) onChange(withRichTextBlock(doc, index, { ...block, kind }));
    },
    onMove: (from, to) => {
      onSelect(undefined);
      onChange(withItemMoved(doc, from, to));
    },
    onRemove: () => {
      onSelect(undefined);
      onChange(withoutRichTextBlock(doc, index));
    },
    onSelectSpan: (span) => onSelect({ block: index, span }),
    onSpanChange: (span, next) => onChange(withRichTextSpan(doc, index, span, next)),
    onSpanRemove: (span) => {
      onSelect(undefined);
      onChange(withoutRichTextSpan(doc, index, span));
    },
    onSpanAdd: (after) => onChange(withRichTextSpanAdded(doc, index, after)),
    onPaste: (span, range, lines) => onChange(withPastedLines(doc, index, span, range, lines)),
  };
}
