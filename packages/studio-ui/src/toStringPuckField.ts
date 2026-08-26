import type { Field } from "@measured/puck";
import type { HintedFieldNode } from "./hintedField.types";
import { isLinkField } from "./isLinkField";
import { toBoundedTextPuckField } from "./toBoundedTextPuckField";
import { toLinkPuckField } from "./toLinkPuckField";

/** The Puck field for a string: the link control when the catalog hints one — it carries
 * the schema's bound itself — the bounded custom control when the schema declares a
 * maximum length, and the stock text field otherwise. */
export function toStringPuckField(field: HintedFieldNode): Field {
  if (isLinkField(field)) {
    return toLinkPuckField(field);
  }
  if (field.maxLength !== undefined) {
    return toBoundedTextPuckField(field, field.maxLength);
  }
  return { type: "text", label: field.path };
}
