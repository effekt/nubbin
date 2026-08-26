"use client";

import {
  isRichTextBlockKind,
  RICH_TEXT_BLOCK_KINDS,
  type RichTextBlock,
  type RichTextSpan,
} from "@nubbin/core";
import { SegmentedEnumField } from "@nubbin/studio-ui";
import { RepeaterRowActions } from "./RepeaterRowActions";
import { RichTextSpanList } from "./RichTextSpanList";

interface RichTextBlockRowProps {
  id: string;
  block: RichTextBlock;
  index: number;
  count: number;
  readOnly: boolean;
  selectedSpan: number | undefined;
  onKind: (kind: RichTextBlock["kind"]) => void;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  onSelectSpan: (span: number) => void;
  onSpanChange: (span: number, next: RichTextSpan) => void;
  onSpanRemove: (span: number) => void;
  onSpanAdd: (after: number) => void;
  onPaste: (span: number, range: { start: number; end: number }, lines: string[]) => void;
}

/** One block of the document: its kind as the segmented control over `core`'s closed set,
 * the reorder and remove buttons the repeater uses, and its spans beneath. */
export function RichTextBlockRow(props: RichTextBlockRowProps) {
  const { id, block, index, count, readOnly } = props;
  return (
    <li id={id} className="nb-richtext-block">
      <div className="nb-richtext-blockhead">
        <SegmentedEnumField
          id={`${id}_kind`}
          label="Kind"
          members={[...RICH_TEXT_BLOCK_KINDS]}
          value={block.kind}
          readOnly={readOnly}
          onChange={(kind) => {
            if (isRichTextBlockKind(kind)) props.onKind(kind);
          }}
        />
        <RepeaterRowActions
          index={index}
          count={count}
          readOnly={readOnly}
          onMove={props.onMove}
          onRemove={props.onRemove}
        />
      </div>
      <RichTextSpanList
        id={`${id}_spans`}
        spans={block.spans}
        readOnly={readOnly}
        selectedSpan={props.selectedSpan}
        onSelectSpan={props.onSelectSpan}
        onSpanChange={props.onSpanChange}
        onSpanRemove={props.onSpanRemove}
        onSpanAdd={props.onSpanAdd}
        onPaste={props.onPaste}
      />
    </li>
  );
}
