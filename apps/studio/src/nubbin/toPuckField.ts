import type { Field } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { directChildFields } from "./directChildFields";
import { rowFieldOf } from "./rowFieldOf";
import { toEnumPuckField } from "./toEnumPuckField";
import { toFieldsetPuckField } from "./toFieldsetPuckField";
import { toReadOnlyPuckField } from "./toReadOnlyPuckField";
import { toRepeaterPuckField } from "./toRepeaterPuckField";
import { toStringPuckField } from "./toStringPuckField";

/** One schema field as Puck's inspector edits it — the same `zodAdapter` description the
 * old inspector read, mapped kind by kind: strings through `toStringPuckField`, enums
 * through `toEnumPuckField`, `number→number`, `boolean→radio`. An array whose row shape
 * the description reaches becomes the repeater, an object with described children the
 * fieldset — which is why the whole description rides along — and every other kind
 * renders read-only rather than guessing. */
export function toPuckField(field: FieldNode, fields: readonly FieldNode[]): Field {
  if (field.kind === "string") {
    return toStringPuckField(field);
  }
  if (field.kind === "number") {
    return { type: "number", label: field.path };
  }
  if (field.kind === "boolean") {
    return {
      type: "radio",
      label: field.path,
      options: [
        { label: "true", value: true },
        { label: "false", value: false },
      ],
    };
  }
  if (field.kind === "enum") {
    return toEnumPuckField(field);
  }
  if (field.kind === "array" && rowFieldOf(fields, field.path) !== undefined) {
    return toRepeaterPuckField(field, fields);
  }
  if (field.kind === "object" && directChildFields(fields, field.path).length > 0) {
    return toFieldsetPuckField(field, fields);
  }
  return toReadOnlyPuckField(field);
}
