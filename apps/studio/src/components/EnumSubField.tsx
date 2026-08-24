"use client";

import "./issuesFlow.css";
import { FieldLabel } from "@measured/puck";
import { SEGMENTED_MAX_MEMBERS } from "../nubbin/segmented.constants";
import { SegmentedEnumField } from "./SegmentedEnumField";

interface EnumSubFieldProps {
  id: string;
  label: string;
  members: readonly string[];
  value: string | undefined;
  readOnly: boolean;
  onChange: (value: string) => void;
}

/** An enum nested in a row or fieldset, folded at the same size as a top-level one: up to
 * three members lay flat as the segmented control, more become a dropdown. */
export function EnumSubField({ id, label, members, value, readOnly, onChange }: EnumSubFieldProps) {
  if (members.length > 0 && members.length <= SEGMENTED_MAX_MEMBERS) {
    return (
      <SegmentedEnumField
        id={id}
        label={label}
        members={members}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
      />
    );
  }
  return (
    <FieldLabel label={label} readOnly={readOnly}>
      <select
        id={id}
        className="nubbin-bounded-input"
        value={value ?? ""}
        disabled={readOnly}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {members.map((member) => (
          <option key={member} value={member}>
            {member}
          </option>
        ))}
      </select>
    </FieldLabel>
  );
}
