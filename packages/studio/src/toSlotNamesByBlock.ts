import type { Registry } from "@nubbin/core";

/** Projects every block's declared slot names for schema-driven editor changes. */
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
