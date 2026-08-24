"use client";

import type { FieldNode } from "@nubbin/core";
import { FieldsetGroup } from "./FieldsetGroup";
import type { SubFieldRender } from "./subField.types";

interface RepeaterRowBodyProps {
  id: string;
  row: unknown;
  rowShape: FieldNode;
  childFields: readonly FieldNode[];
  fields: readonly FieldNode[];
  readOnly: boolean;
  onChange: (row: unknown) => void;
  renderField: SubFieldRender;
}

/** What an expanded row holds: an object row is an unlabelled fieldset over its own
 * fields; a scalar row is a single control editing the row itself. */
export function RepeaterRowBody(props: RepeaterRowBodyProps) {
  const { id, row, rowShape, childFields, fields, readOnly, onChange } = props;
  const RenderField = props.renderField;
  if (childFields.length === 0) {
    return (
      <RenderField
        field={rowShape}
        fields={fields}
        id={id}
        value={row}
        readOnly={readOnly}
        onChange={onChange}
      />
    );
  }
  return (
    <FieldsetGroup
      id={id}
      fields={childFields}
      allFields={fields}
      value={row}
      readOnly={readOnly}
      onChange={onChange}
      renderField={props.renderField}
    />
  );
}
