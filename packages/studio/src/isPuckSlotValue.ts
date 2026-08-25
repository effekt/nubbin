import { isPuckComponentData } from "./isPuckComponentData";
import type { PuckComponentData } from "./puckData.types";

/** Whether a prop value reads as a slot's children: a non-empty array of Puck components.
 * An empty array is deliberately not one — `[]` is also a legal ordinary prop, and only the
 * prior draft knows which the key was, so `fromPuckComponent` settles the empty case there. */
export function isPuckSlotValue(value: unknown): value is PuckComponentData[] {
  return Array.isArray(value) && value.length > 0 && value.every(isPuckComponentData);
}
