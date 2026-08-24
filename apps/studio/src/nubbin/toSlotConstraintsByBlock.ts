import type { Registry, SlotConstraint } from "@nubbin/core";

/** Every block's declared slots with their constraints, keyed by block name — what the
 * outline needs to name a node's areas and say how full each is against its `max`. Derived
 * from the registry, where the constraints already live. */
export function toSlotConstraintsByBlock(
  registry: Registry,
): Record<string, Record<string, SlotConstraint>> {
  const slots: Record<string, Record<string, SlotConstraint>> = {};
  for (const name of registry.names()) {
    const block = registry.get(name);
    if (block !== undefined) {
      slots[name] = { ...block.slots };
    }
  }
  return slots;
}
