import type { Field } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { toBoundedTextPuckField } from "./toBoundedTextPuckField";
import { toReadOnlyPuckField } from "./toReadOnlyPuckField";
import { toSegmentedEnumPuckField } from "./toSegmentedEnumPuckField";

/* The wireframes' rule, and the specimen's: an enum an author can see whole lays flat as
 * segments; past this many members it folds into a dropdown. */
const SEGMENTED_MAX_MEMBERS = 3;

/** One schema field as Puck's inspector edits it — the same `zodAdapter` description the
 * old inspector read, mapped kind by kind: `string→text`, `number→number`, `boolean→radio`,
 * `enum→select`, with an enum of up to three members rendering as the segmented control
 * instead. A string whose schema bounds its length gets the bounded control — counter
 * and over-limit line — and every other kind renders read-only rather than guessing. */
export function toPuckField(field: FieldNode): Field {
  if (field.kind === "string") {
    if (field.maxLength !== undefined) {
      return toBoundedTextPuckField(field, field.maxLength);
    }
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
    if (members.length > 0 && members.length <= SEGMENTED_MAX_MEMBERS) {
      return toSegmentedEnumPuckField(field, members);
    }
    return {
      type: "select",
      label: field.path,
      options: members.map((member) => ({ label: member, value: member })),
    };
  }
  return toReadOnlyPuckField(field);
}
