"use client";

import "./issuesFlow.css";
import { FieldLabel } from "@measured/puck";

interface NumberInputFieldProps {
  id: string;
  label: string;
  value: number | undefined;
  readOnly: boolean;
  onChange: (value: number | undefined) => void;
}

/** The number control for a numeric field nested in a row or fieldset: a stock number
 * input in the bounded control's chrome. Clearing it hands back `undefined` rather than
 * zero — an emptied field is absent, not a claim of nought. */
export function NumberInputField({ id, label, value, readOnly, onChange }: NumberInputFieldProps) {
  return (
    <FieldLabel label={label} readOnly={readOnly}>
      <input
        type="number"
        id={id}
        className="nubbin-bounded-input"
        value={value ?? ""}
        readOnly={readOnly}
        onChange={(event) => {
          const next = event.currentTarget.valueAsNumber;
          onChange(Number.isNaN(next) ? undefined : next);
        }}
      />
    </FieldLabel>
  );
}
