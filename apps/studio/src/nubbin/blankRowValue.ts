import type { FieldNode } from "@nubbin/core";
import { leafFieldName } from "@nubbin/studio-ui";
import { directChildFields } from "./directChildFields";

const BLANK_BY_KIND: Readonly<Partial<Record<FieldNode["kind"], unknown>>> = {
  string: "",
  number: 0,
  boolean: false,
  array: [],
};

/** The value a freshly added repeater row starts from: the emptiest thing each kind can
 * be — an empty string, zero, `false`, an enum's first member, an empty list — with an
 * object row carrying only its required fields, blanked the same way. Blank is allowed to
 * be invalid: the draft is permissive, and compile remains the judge. */
export function blankRowValue(field: FieldNode, fields: readonly FieldNode[]): unknown {
  if (field.kind === "enum") return field.members?.[0] ?? "";
  if (field.kind !== "object") return BLANK_BY_KIND[field.kind];
  const row: Record<string, unknown> = {};
  for (const child of directChildFields(fields, field.path)) {
    if (child.optional) continue;
    const value = blankRowValue(child, fields);
    if (value !== undefined) row[leafFieldName(child.path)] = value;
  }
  return row;
}
