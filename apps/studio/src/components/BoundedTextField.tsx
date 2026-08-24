"use client";

import "./issuesFlow.css";
import { FieldLabel } from "@measured/puck";
import { BoundedTextMeta } from "./BoundedTextMeta";

interface BoundedTextFieldProps {
  id: string;
  label: string;
  max: number;
  value: string | undefined;
  readOnly: boolean;
  onChange: (value: string) => void;
}

/** The text control for a string the schema bounds: the stock input with a live `len/max`
 * counter, and — past the bound — the design's own line beside it with the border toned to
 * match. Display only: typing past the bound still saves, because the draft is permissive
 * and publish is the gate. The words carry the state; the tone only underlines them. */
export function BoundedTextField({
  id,
  label,
  max,
  value,
  readOnly,
  onChange,
}: BoundedTextFieldProps) {
  const text = value ?? "";
  const isOver = text.length > max;
  return (
    <FieldLabel label={label} readOnly={readOnly}>
      <div className={isOver ? "nubbin-bounded-over" : undefined}>
        <input
          type="text"
          id={id}
          className="nubbin-bounded-input"
          value={text}
          readOnly={readOnly}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
        <BoundedTextMeta max={max} length={text.length} />
      </div>
    </FieldLabel>
  );
}
