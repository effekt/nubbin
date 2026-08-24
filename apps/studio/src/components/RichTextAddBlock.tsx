"use client";

import { RICH_TEXT_BLOCK_KINDS, type RichTextBlockKind } from "@nubbin/core";

interface RichTextAddBlockProps {
  readOnly: boolean;
  onAdd: (kind: RichTextBlockKind) => void;
}

const KIND_LABELS: Record<RichTextBlockKind, string> = {
  paragraph: "Add paragraph",
  listItem: "Add list item",
};

/** The controls that grow the document: one add button per block kind in `core`'s closed
 * set — the kinds are the buttons, exactly as the marks are the toolbar. */
export function RichTextAddBlock({ readOnly, onAdd }: RichTextAddBlockProps) {
  return (
    <div className="nb-richtext-add">
      {RICH_TEXT_BLOCK_KINDS.map((kind) => (
        <button key={kind} type="button" disabled={readOnly} onClick={() => onAdd(kind)}>
          {KIND_LABELS[kind]}
        </button>
      ))}
    </div>
  );
}
