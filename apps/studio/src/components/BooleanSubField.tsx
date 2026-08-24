"use client";

import { EnumSubField } from "./EnumSubField";

interface BooleanSubFieldProps {
  id: string;
  label: string;
  value: unknown;
  readOnly: boolean;
  onChange: (value: boolean) => void;
}

/** A boolean nested in a row or fieldset as a two-segment row — the same control an enum
 * of two members gets, so true and false read as a choice rather than a checkbox. */
export function BooleanSubField({ id, label, value, readOnly, onChange }: BooleanSubFieldProps) {
  const picked = typeof value === "boolean" ? String(value) : undefined;
  return (
    <EnumSubField
      id={id}
      label={label}
      members={["true", "false"]}
      value={picked}
      readOnly={readOnly}
      onChange={(member) => onChange(member === "true")}
    />
  );
}
