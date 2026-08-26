"use client";

import "./repeaterField.css";
import type { FieldNode } from "@nubbin/core";
import { blankRowValue } from "./blankRowValue";
import { directChildFields } from "./directChildFields";
import { RepeaterHead } from "./RepeaterHead";
import { RepeaterRow } from "./RepeaterRow";
import { RepeaterRowBody } from "./RepeaterRowBody";
import { rowFieldOf } from "./rowFieldOf";
import type { SubFieldRender } from "./subField.types";
import { toRowLabel } from "./toRowLabel";
import { useRowKeys } from "./useRowKeys";
import { withItemMoved } from "./withItemMoved";

interface RepeaterFieldProps {
  id: string;
  label: string;
  field: FieldNode;
  fields: readonly FieldNode[];
  value: unknown;
  readOnly: boolean;
  onChange: (value: unknown[]) => void;
  renderField: SubFieldRender;
}

/** An array prop as the wireframes' repeater: rows under generated keys stable across
 * reorder, each labelled by its own first string field, collapsed behind a disclosure,
 * dragged by the handle or moved by the row's buttons, with add and remove disabled at
 * the schema's own bounds and the reason in the control's title. */
export function RepeaterField(props: RepeaterFieldProps) {
  const { id, label, field, fields, value, readOnly, onChange } = props;
  const rows: readonly unknown[] = Array.isArray(value) ? value : [];
  const rowKeys = useRowKeys(rows.length);
  const rowShape = rowFieldOf(fields, field.path);
  if (rowShape === undefined) return null;
  const childFields = directChildFields(fields, rowShape.path);
  const move = (from: number, to: number) => {
    rowKeys.move(from, to);
    onChange(withItemMoved(rows, from, to));
  };
  return (
    <fieldset id={id} className="nb-repeater" aria-label={label}>
      <RepeaterHead
        label={label}
        count={rows.length}
        maxItems={field.maxItems}
        readOnly={readOnly}
        onAdd={() => {
          rowKeys.insert(rows.length);
          onChange([...rows, blankRowValue(rowShape, fields)]);
        }}
      />
      <ul className="nb-repeater-rows">
        {rows.map((row, index) => (
          <RepeaterRow
            key={rowKeys.keys[index] ?? `pending-${index}`}
            label={toRowLabel(row, childFields)}
            index={index}
            count={rows.length}
            minItems={field.minItems}
            readOnly={readOnly}
            onMove={move}
            onRemove={() => {
              rowKeys.remove(index);
              onChange(rows.filter((_, at) => at !== index));
            }}
          >
            <RepeaterRowBody
              id={`${id}_${index}`}
              row={row}
              rowShape={rowShape}
              childFields={childFields}
              fields={fields}
              readOnly={readOnly}
              onChange={(next) => onChange(rows.map((at, i) => (i === index ? next : at)))}
              renderField={props.renderField}
            />
          </RepeaterRow>
        ))}
      </ul>
    </fieldset>
  );
}
