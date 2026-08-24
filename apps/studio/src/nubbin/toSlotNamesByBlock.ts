import type { Registry } from "@nubbin/core";

/** Every block's declared slot names, keyed by block name — what `fromPuckData` needs to
 * tell a slot-typed prop from an ordinary one by schema rather than by shape, closing the
 * structural ambiguity the adapter documents. Derived from the registry, where the slots
 * already live. */
export function toSlotNamesByBlock(registry: Registry): Record<string, readonly string[]> {
  const slotNames: Record<string, readonly string[]> = {};
  for (const name of registry.names()) {
    const block = registry.get(name);
    if (block !== undefined) {
      slotNames[name] = Object.keys(block.slots);
    }
  }
  return slotNames;
}
