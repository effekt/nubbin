import type { SlotField } from "@measured/puck";
import type { SlotConstraint } from "@nubbin/core";

/** One declared slot as Puck's slot-typed field. `allow` carries over so an illegal drop is
 * refused before it lands; `min` and `max` do not — Puck has no bound to give them, so they
 * surface through compile and block publish instead. An unconstrained slot omits `allow`,
 * which to Puck means any component. */
export function toSlotField(constraint: SlotConstraint): SlotField {
  const field: SlotField = { type: "slot" };
  if (constraint.allow !== undefined) {
    field.allow = [...constraint.allow];
  }
  return field;
}
