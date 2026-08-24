import type { FieldNode } from "@nubbin/core";
import { leafFieldName } from "./leafFieldName";

/** A repeater row's label, read from the row itself: a scalar row is its own value, an
 * object row shows the value of its first string field — a stat's label, a logo's name —
 * never an index. `undefined` means the row has nothing to say for itself yet, and the
 * repeater renders its untitled state instead. */
export function toRowLabel(row: unknown, childFields: readonly FieldNode[]): string | undefined {
  if (typeof row === "string") {
    return row.trim() === "" ? undefined : row;
  }
  if (typeof row !== "object" || row === null) return undefined;
  const named = childFields.find((field) => field.kind === "string");
  if (named === undefined) return undefined;
  const value = (row as Record<string, unknown>)[leafFieldName(named.path)];
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}
