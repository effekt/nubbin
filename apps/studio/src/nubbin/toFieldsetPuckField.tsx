import type { CustomField } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { directChildFields, FieldsetGroup, SubFieldControl } from "@nubbin/studio-ui";

/** The Puck field for an object whose fields the description reaches: a custom field
 * whose render is the studio's fieldset group, recursing per sub-field through the same
 * per-kind controls the top level uses. */
export function toFieldsetPuckField(
  field: FieldNode,
  fields: readonly FieldNode[],
): CustomField<Record<string, unknown>> {
  return {
    type: "custom",
    label: field.path,
    render: ({ id, field: rendered, value, onChange, readOnly }) => (
      <FieldsetGroup
        id={id}
        label={rendered.label ?? field.path}
        fields={directChildFields(fields, field.path)}
        allFields={fields}
        value={value}
        readOnly={readOnly === true}
        onChange={onChange}
        renderField={SubFieldControl}
      />
    ),
  };
}
