"use client";

import "./segmentedEnumField.css";

interface SegmentedEnumFieldProps {
  id: string;
  label: string;
  members: readonly string[];
  value: string | undefined;
  readOnly: boolean;
  onChange: (next: string) => void;
}

/** A small enum as the specimen's segmented row: one radio per member inside a fieldset,
 * so the keyboard walks it with arrows and a reader hears one named group — the segment
 * look is styling over real inputs, and the checked one is told by fill and weight, never
 * hue alone. The dropdown remains the control for enums past three members. */
export function SegmentedEnumField({
  id,
  label,
  members,
  value,
  readOnly,
  onChange,
}: SegmentedEnumFieldProps) {
  return (
    <fieldset className="nb-seg-field">
      <legend>{label}</legend>
      <div className="nb-seg">
        {members.map((member) => (
          <label key={member} className="nb-seg-option">
            <input
              type="radio"
              name={id}
              value={member}
              checked={value === member}
              disabled={readOnly}
              onChange={() => onChange(member)}
            />
            {member}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
