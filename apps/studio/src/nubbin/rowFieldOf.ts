import type { FieldNode } from "@nubbin/core";

/** The row shape an array field's members share — the described node at `path[]`, or
 * `undefined` when the description never descended into the array's items. */
export function rowFieldOf(fields: readonly FieldNode[], path: string): FieldNode | undefined {
  return fields.find((field) => field.path === `${path}[]`);
}
