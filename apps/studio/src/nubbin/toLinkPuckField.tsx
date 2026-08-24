import type { CustomField } from "@measured/puck";
import { LinkTextField } from "../components/LinkTextField";
import type { HintedFieldNode } from "./hintedField.types";

/** The Puck field for a string the catalog hints as a link: a custom field whose render is
 * the studio's link control — live format check, quiet note, Open when valid, and the
 * schema's counter where it bounds the string. The value flows through `onChange`
 * unjudged, because the draft stays permissive and compile remains the gate. */
export function toLinkPuckField(field: HintedFieldNode): CustomField<string> {
  return {
    type: "custom",
    label: field.path,
    render: ({ id, field: rendered, value, onChange, readOnly }) => (
      <LinkTextField
        id={id}
        label={rendered.label ?? field.path}
        max={field.maxLength}
        value={value}
        readOnly={readOnly === true}
        onChange={onChange}
      />
    ),
  };
}
