import type { Field } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { toReadOnlyPuckField } from "./toReadOnlyPuckField";

/** One schema field as Puck's inspector edits it — the same `zodAdapter` description the
 * old inspector read, mapped kind by kind: `string→text`, `number→number`, `boolean→radio`,
 * `enum→select`. Every other kind renders read-only rather than guessing at a control. */
export function toPuckField(field: FieldNode): Field {
  if (field.kind === "string") {
    return { type: "text", label: field.path };
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
    const members = field.members ?? [];
    return {
      type: "select",
      label: field.path,
      options: members.map((member) => ({ label: member, value: member })),
    };
  }
  return toReadOnlyPuckField(field);
}
