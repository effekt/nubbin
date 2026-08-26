import type { CustomField } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { BoundedTextField } from "./BoundedTextField";

/** The Puck field for a string whose schema declares a maximum length: a custom field whose
 * render is the studio's bounded text control — live counter, over-limit line, toned border.
 * The bound shapes only what the author sees; the value flows through `onChange` unclipped,
 * because the draft stays permissive and compile remains the judge. */
export function toBoundedTextPuckField(field: FieldNode, max: number): CustomField<string> {
  return {
    type: "custom",
    label: field.path,
    render: ({ id, field: rendered, value, onChange, readOnly }) => (
      <BoundedTextField
        id={id}
        label={rendered.label ?? field.path}
        max={max}
        value={value}
        readOnly={readOnly === true}
        onChange={onChange}
      />
    ),
  };
}
