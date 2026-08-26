import { type HintedFieldNode, isLinkField, leafFieldName } from "@nubbin/studio-ui";

/** A repeater row's label, read from the row itself: a scalar row is its own value, an
 * object row shows the value of its first string field the catalog did not hint as a
 * link — a stat's label, a gallery picture's alt — never an index. A link-hinted field
 * is a destination, not a name, so it never speaks for the row. `undefined` means the
 * row has nothing to say for itself yet, and the repeater renders its untitled state. */
export function toRowLabel(
  row: unknown,
  childFields: readonly HintedFieldNode[],
): string | undefined {
  if (typeof row === "string") {
    return row.trim() === "" ? undefined : row;
  }
  if (typeof row !== "object" || row === null) return undefined;
  const named = childFields.find((field) => field.kind === "string" && !isLinkField(field));
  if (named === undefined) return undefined;
  const value = (row as Record<string, unknown>)[leafFieldName(named.path)];
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}
