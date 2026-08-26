"use client";

import { RICH_TEXT_MARKS, type RichTextMark, type RichTextSpan } from "@nubbin/core";

interface RichTextToolbarProps {
  span: RichTextSpan | undefined;
  readOnly: boolean;
  onToggleMark: (mark: RichTextMark) => void;
  onToggleLink: () => void;
}

const MARK_GLYPHS: Record<RichTextMark, string> = { strong: "B", em: "I", code: "‹›" };

/** The fixed toolbar: one toggle per mark in `core`'s closed set, and one for the link.
 * Each is a real button whose `aria-pressed` is what the selected span carries, disabled
 * until a span is selected. The set is the type system's own — nothing here can produce
 * what the schema would refuse. */
export function RichTextToolbar(props: RichTextToolbarProps) {
  const { span, readOnly, onToggleMark, onToggleLink } = props;
  const disabled = readOnly || span === undefined;
  return (
    <div className="nb-richtext-toolbar" role="toolbar" aria-label="Text style">
      {RICH_TEXT_MARKS.map((mark) => (
        <button
          key={mark}
          type="button"
          aria-label={mark}
          aria-pressed={span?.marks?.includes(mark) === true}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onToggleMark(mark)}
        >
          <span aria-hidden="true">{MARK_GLYPHS[mark]}</span>
        </button>
      ))}
      <button
        type="button"
        aria-label="link"
        aria-pressed={span !== undefined && span.href !== undefined}
        disabled={disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onToggleLink}
      >
        <span aria-hidden="true">🔗</span>
      </button>
    </div>
  );
}
