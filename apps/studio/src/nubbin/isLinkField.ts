import type { HintedFieldNode } from "./hintedField.types";

/** Whether a described field is a string the catalog hinted as a destination — the one
 * combination the link control edits. A `control: "link"` on a non-string kind is a hint
 * the control cannot honour, so it falls through to the kind's own renderer. */
export function isLinkField(field: HintedFieldNode): boolean {
  return field.kind === "string" && field.control === "link";
}
