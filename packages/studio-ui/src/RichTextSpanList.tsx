"use client";

import type { RichTextSpan } from "@nubbin/core";
import { RichTextSpanRow } from "./RichTextSpanRow";
import { useRowKeys } from "./useRowKeys";

interface RichTextSpanListProps {
  id: string;
  spans: readonly RichTextSpan[];
  readOnly: boolean;
  selectedSpan: number | undefined;
  onSelectSpan: (span: number) => void;
  onSpanChange: (span: number, next: RichTextSpan) => void;
  onSpanRemove: (span: number) => void;
  onSpanAdd: (after: number) => void;
  onPaste: (span: number, range: { start: number; end: number }, lines: string[]) => void;
}

/** One block's spans in order, under generated keys so an insert or remove never remounts
 * a neighbour mid-keystroke, with the add control that seats a new run at the end. */
export function RichTextSpanList(props: RichTextSpanListProps) {
  const { id, spans, readOnly, selectedSpan } = props;
  const rowKeys = useRowKeys(spans.length);
  return (
    <div id={id} className="nb-richtext-spans">
      {spans.map((span, at) => (
        <RichTextSpanRow
          key={rowKeys.keys[at] ?? `pending-${at}`}
          id={`${id}_${at}`}
          span={span}
          readOnly={readOnly}
          selected={selectedSpan === at}
          onSelect={() => props.onSelectSpan(at)}
          onChange={(next) => props.onSpanChange(at, next)}
          onRemove={() => {
            rowKeys.remove(at);
            props.onSpanRemove(at);
          }}
          onPaste={(range, lines) => props.onPaste(at, range, lines)}
        />
      ))}
      <button
        type="button"
        className="nb-richtext-addspan"
        disabled={readOnly}
        onClick={() => {
          rowKeys.insert(spans.length);
          props.onSpanAdd(spans.length - 1);
        }}
      >
        Add span
      </button>
    </div>
  );
}
