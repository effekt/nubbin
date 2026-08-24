"use client";

import type { RichText } from "@nubbin/core";
import { toRichTextRowHandlers } from "../nubbin/toRichTextRowHandlers";
import { RichTextBlockRow } from "./RichTextBlockRow";
import type { RichTextSelection } from "./richTextSelection.types";
import { useRowKeys } from "./useRowKeys";

interface RichTextBlockListProps {
  id: string;
  doc: RichText;
  readOnly: boolean;
  selection: RichTextSelection | undefined;
  onSelect: (selection: RichTextSelection | undefined) => void;
  onChange: (next: RichText) => void;
}

/** The document's blocks in order, under generated keys stable across reorder, each row
 * wired to the pure edits through one handler set — so every change the control can make
 * is a typed document. */
export function RichTextBlockList(props: RichTextBlockListProps) {
  const { id, doc, readOnly, selection, onSelect, onChange } = props;
  const rowKeys = useRowKeys(doc.length);
  return (
    <ol className="nb-richtext-blocks">
      {doc.map((block, index) => {
        const handlers = toRichTextRowHandlers(doc, index, onChange, onSelect);
        return (
          <RichTextBlockRow
            key={rowKeys.keys[index] ?? `pending-${index}`}
            id={`${id}_${index}`}
            block={block}
            index={index}
            count={doc.length}
            readOnly={readOnly}
            selectedSpan={selection?.block === index ? selection.span : undefined}
            onKind={handlers.onKind}
            onMove={(from, to) => {
              rowKeys.move(from, to);
              handlers.onMove(from, to);
            }}
            onRemove={() => {
              rowKeys.remove(index);
              handlers.onRemove();
            }}
            onSelectSpan={handlers.onSelectSpan}
            onSpanChange={handlers.onSpanChange}
            onSpanRemove={handlers.onSpanRemove}
            onSpanAdd={handlers.onSpanAdd}
            onPaste={handlers.onPaste}
          />
        );
      })}
    </ol>
  );
}
