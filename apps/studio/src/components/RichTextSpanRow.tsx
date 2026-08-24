"use client";

import type { RichTextSpan } from "@nubbin/core";
import { pastedLines } from "../nubbin/pastedLines";

interface RichTextSpanRowProps {
  id: string;
  span: RichTextSpan;
  readOnly: boolean;
  selected: boolean;
  onSelect: () => void;
  onChange: (span: RichTextSpan) => void;
  onRemove: () => void;
  onPaste: (range: { start: number; end: number }, lines: string[]) => void;
}

/** One span of a block: its text in a plain input — the clipboard reaches it as
 * `text/plain` only, so markup can never enter — its link target when it carries one, and
 * a remove control. Focusing the text selects the span for the fixed toolbar's toggles;
 * a multi-line paste is handed up to fold into further paragraphs. */
export function RichTextSpanRow(props: RichTextSpanRowProps) {
  const { id, span, readOnly, selected, onSelect, onChange, onRemove, onPaste } = props;
  return (
    <div
      id={id}
      className={selected ? "nb-richtext-span nb-richtext-span-selected" : "nb-richtext-span"}
    >
      <input
        type="text"
        id={`${id}_text`}
        className="nb-richtext-text"
        aria-label="Span text"
        value={span.text}
        readOnly={readOnly}
        onFocus={onSelect}
        onChange={(event) => onChange({ ...span, text: event.currentTarget.value })}
        onPaste={(event) => {
          const lines = pastedLines(event.clipboardData.getData("text/plain"));
          if (lines.length <= 1) return;
          event.preventDefault();
          const { selectionStart, selectionEnd } = event.currentTarget;
          onPaste({ start: selectionStart ?? 0, end: selectionEnd ?? 0 }, lines);
        }}
      />
      {span.href === undefined ? null : (
        <input
          type="text"
          id={`${id}_href`}
          className="nb-richtext-href"
          aria-label="Link target"
          value={span.href}
          readOnly={readOnly}
          onFocus={onSelect}
          onChange={(event) => onChange({ ...span, href: event.currentTarget.value })}
        />
      )}
      <button type="button" aria-label="Remove span" disabled={readOnly} onClick={onRemove}>
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
