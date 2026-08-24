import type { Node } from "@nubbin/core";
import { isPuckSlotValue } from "./isPuckSlotValue";

/** Whether one prop entry is a slot's children. With the block's declared slot names in hand
 * — the editor passes them, derived from the registry — the schema decides: a declared name
 * holding an array is a slot, empty included, and any other key is an ordinary prop however
 * component-shaped its value. Without them the structural reading stands: a non-empty array
 * of components is a slot, and an empty array only when the prior node held that key as one. */
export function isSlotEntry(
  key: string,
  value: unknown,
  priorNode: Node | undefined,
  declaredSlots: readonly string[] | undefined,
): boolean {
  if (declaredSlots !== undefined) {
    return declaredSlots.includes(key) && Array.isArray(value);
  }
  if (isPuckSlotValue(value)) {
    return true;
  }
  return Array.isArray(value) && value.length === 0 && priorNode?.slots?.[key] !== undefined;
}
