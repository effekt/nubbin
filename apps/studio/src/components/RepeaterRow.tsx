"use client";

import { type ReactNode, useState } from "react";
import { RepeaterRowActions } from "./RepeaterRowActions";

interface RepeaterRowProps {
  label: string | undefined;
  index: number;
  count: number;
  minItems?: number | undefined;
  readOnly: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  children: ReactNode;
}

/** One repeater row: a drag handle, a disclosure that carries the row's own label — or the
 * warning glyph and the word untitled when it has none — and the reorder and remove
 * controls. The disclosure state lives here, so it rides the row's generated key through a
 * reorder instead of resetting. The handle is drag-only and hidden from assistive tech; the
 * move buttons are the keyboard's path to the same reorder. */
export function RepeaterRow(props: RepeaterRowProps) {
  const { label, index, count, minItems, readOnly, onMove, onRemove, children } = props;
  const [open, setOpen] = useState(false);
  return (
    <li
      className="nb-repeater-row"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const from = Number(event.dataTransfer.getData("text/plain"));
        if (Number.isInteger(from) && from !== index) onMove(from, index);
      }}
    >
      <div className="nb-repeater-rowhead">
        <span
          className="nb-repeater-grip"
          aria-hidden="true"
          draggable={!readOnly}
          onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))}
        >
          ⠿
        </span>
        <button
          type="button"
          className="nb-repeater-disclose"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden="true">{open ? "▾" : "▸"}</span>
          {label === undefined ? (
            <span className="nb-repeater-untitled">
              <span aria-hidden="true">⚠ </span>(untitled)
            </span>
          ) : (
            <span className="nb-repeater-title">{label}</span>
          )}
        </button>
        <RepeaterRowActions
          index={index}
          count={count}
          minItems={minItems}
          readOnly={readOnly}
          onMove={onMove}
          onRemove={onRemove}
        />
      </div>
      {open ? <div className="nb-repeater-rowbody">{children}</div> : null}
    </li>
  );
}
