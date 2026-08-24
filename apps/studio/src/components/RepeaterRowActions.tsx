"use client";

import { needsAtLeastLine } from "../nubbin/needsAtLeastLine";

interface RepeaterRowActionsProps {
  index: number;
  count: number;
  minItems?: number | undefined;
  readOnly: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}

/** One row's controls: keyboard reorder as real buttons — the ends disable their own
 * direction — and remove, disabled at the array's min with the reason in its title. */
export function RepeaterRowActions(props: RepeaterRowActionsProps) {
  const { index, count, minItems, readOnly, onMove, onRemove } = props;
  const atMin = minItems !== undefined && count <= minItems;
  return (
    <span className="nb-repeater-actions">
      <button
        type="button"
        aria-label="Move row up"
        disabled={readOnly || index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <span aria-hidden="true">↑</span>
      </button>
      <button
        type="button"
        aria-label="Move row down"
        disabled={readOnly || index === count - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <span aria-hidden="true">↓</span>
      </button>
      <button
        type="button"
        aria-label="Remove row"
        disabled={readOnly || atMin}
        title={minItems !== undefined && atMin ? needsAtLeastLine(minItems) : undefined}
        onClick={onRemove}
      >
        <span aria-hidden="true">🗑</span>
      </button>
    </span>
  );
}
