"use client";

import { holdsAtMostLine } from "./holdsAtMostLine";

interface RepeaterHeadProps {
  label: string;
  count: number;
  maxItems?: number | undefined;
  readOnly: boolean;
  onAdd: () => void;
}

/** The repeater's header row: the list's name with its count against the bound, and the
 * add control — disabled at the array's max with the reason in its title, the wireframes'
 * rule, rather than hidden with no explanation. */
export function RepeaterHead({ label, count, maxItems, readOnly, onAdd }: RepeaterHeadProps) {
  const atMax = maxItems !== undefined && count >= maxItems;
  return (
    <div className="nb-repeater-head">
      <span className="nb-repeater-count">
        {label} ({count}
        {maxItems === undefined ? "" : ` / ${maxItems}`})
      </span>
      <button
        type="button"
        className="nb-repeater-add"
        disabled={atMax || readOnly}
        title={maxItems !== undefined && atMax ? holdsAtMostLine(maxItems) : undefined}
        onClick={onAdd}
      >
        + Add
      </button>
    </div>
  );
}
