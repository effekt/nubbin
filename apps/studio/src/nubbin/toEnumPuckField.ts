import type { Field } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { SEGMENTED_MAX_MEMBERS } from "./segmented.constants";
import { toSegmentedEnumPuckField } from "./toSegmentedEnumPuckField";

/** The Puck field for an enum: up to three members lay flat as the segmented control,
 * more — or none described — become a dropdown over exactly what the schema names. */
export function toEnumPuckField(field: FieldNode): Field {
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
