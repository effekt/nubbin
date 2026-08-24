import type { Field } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { toBoundedTextPuckField } from "./toBoundedTextPuckField";

/** The Puck field for a string: the bounded custom control when the schema declares a
 * maximum length — counter and over-limit line — and the stock text field otherwise. */
export function toStringPuckField(field: FieldNode): Field {
  if (field.maxLength !== undefined) {
    return toBoundedTextPuckField(field, field.maxLength);
  }
  return { type: "text", label: field.path };
}
