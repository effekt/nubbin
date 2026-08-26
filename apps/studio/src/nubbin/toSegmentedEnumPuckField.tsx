import type { CustomField } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { SegmentedEnumField } from "@nubbin/studio-ui";

/** The Puck field for an enum small enough to lay flat: a custom field whose render is the
 * studio's segmented control — real radios under the segment look, one per member. The
 * members come from the schema's own description, exactly as the select variant reads them. */
export function toSegmentedEnumPuckField(
  field: FieldNode,
  members: readonly string[],
): CustomField<string> {
  return {
    type: "custom",
    label: field.path,
    render: ({ id, field: rendered, value, onChange, readOnly }) => (
      <SegmentedEnumField
        id={id}
        label={rendered.label ?? field.path}
        members={members}
        value={value}
        readOnly={readOnly === true}
        onChange={onChange}
      />
    ),
  };
}
