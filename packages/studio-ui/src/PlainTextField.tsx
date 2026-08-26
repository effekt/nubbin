"use client";

import "./issuesFlow.css";
import { FieldLabel } from "@measured/puck";

interface PlainTextFieldProps {
  id: string;
  label: string;
  value: string | undefined;
  readOnly: boolean;
  onChange: (value: string) => void;
}

/** The text control for an unbounded string nested in a row or fieldset: the bounded
 * control's own input without the counter, so a plain string and a bounded one sit in the
 * same chrome side by side. */
export function PlainTextField({ id, label, value, readOnly, onChange }: PlainTextFieldProps) {
  return (
    <FieldLabel label={label} readOnly={readOnly}>
      <input
        type="text"
        id={id}
        className="nubbin-bounded-input"
        value={value ?? ""}
        readOnly={readOnly}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </FieldLabel>
  );
}
