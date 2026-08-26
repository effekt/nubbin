import type { CustomField } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { RepeaterField } from "./RepeaterField";
import { SubFieldControl } from "./SubFieldControl";

/** The Puck field for an array whose rows the description reaches: a custom field whose
 * render is the studio's repeater, carrying the whole description so the rows recurse
 * through the same per-kind controls the top level uses. The schema's own bounds ride in
 * on the FieldNode; the repeater disables add and remove at them and says why. */
export function toRepeaterPuckField(
  field: FieldNode,
  fields: readonly FieldNode[],
): CustomField<unknown[]> {
  return {
    type: "custom",
    label: field.path,
    render: ({ id, field: rendered, value, onChange, readOnly }) => (
      <RepeaterField
        id={id}
        label={rendered.label ?? field.path}
        field={field}
        fields={fields}
        value={value}
        readOnly={readOnly === true}
        onChange={onChange}
        renderField={SubFieldControl}
      />
    ),
  };
}
