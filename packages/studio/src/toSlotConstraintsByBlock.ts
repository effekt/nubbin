import type { Registry, SlotConstraint } from "@nubbin/core";

/** Projects every block's slot constraints for the editor outline. */
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
