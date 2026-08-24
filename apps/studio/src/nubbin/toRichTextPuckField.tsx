import type { CustomField } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { RichTextField } from "../components/RichTextField";

/** The Puck field for a rich-text array: a custom field whose render is the studio's
 * rich-text control — typed blocks and spans behind a fixed toolbar, never markup. The
 * described node rides along so a value the type cannot hold still shows read-only. */
export function toRichTextPuckField(field: FieldNode): CustomField<unknown> {
  return {
    type: "custom",
    label: field.path,
    render: ({ id, field: rendered, value, onChange, readOnly }) => (
      <RichTextField
        id={id}
        label={rendered.label ?? field.path}
        field={field}
        value={value}
        readOnly={readOnly === true}
        onChange={onChange}
      />
    ),
  };
}
