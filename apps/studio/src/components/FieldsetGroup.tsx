"use client";

import "./repeaterField.css";
import type { FieldNode } from "@nubbin/core";
import { leafFieldName, type SubFieldRender } from "@nubbin/studio-ui";

interface FieldsetGroupProps {
  id: string;
  label?: string | undefined;
  fields: readonly FieldNode[];
  allFields: readonly FieldNode[];
  value: unknown;
  readOnly: boolean;
  onChange: (value: Record<string, unknown>) => void;
  renderField: SubFieldRender;
}

/** An object prop as the wireframes' fieldset: an indented group recursing per sub-field
 * through the injected renderer, each child writing back into a copy of the object. An
 * absent object — an optional `cta` never set — edits as an empty one, and grows keys as
 * the author fills it in; compile judges what it amounts to. */
export function FieldsetGroup(props: FieldsetGroupProps) {
  const { id, label, fields, allFields, value, readOnly, onChange } = props;
  const RenderField = props.renderField;
  const data: Record<string, unknown> =
    typeof value === "object" && value !== null ? { ...value } : {};
  return (
    <fieldset id={id} className="nb-fieldset">
      {label === undefined ? null : <legend className="nb-fieldset-legend">{label}</legend>}
      {fields.map((child) => {
        const name = leafFieldName(child.path);
        return (
          <RenderField
            key={child.path}
            field={child}
            fields={allFields}
            id={`${id}_${name}`}
            value={data[name]}
            readOnly={readOnly}
            onChange={(next) => onChange({ ...data, [name]: next })}
          />
        );
      })}
    </fieldset>
  );
}
