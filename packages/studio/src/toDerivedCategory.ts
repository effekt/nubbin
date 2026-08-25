import type { Registry } from "@nubbin/core";

/**
 * The fallback section for a block that declares no category: a block with a slot arranges
 * other blocks, so it files under Layout; everything else is Content. Derived from the slot
 * declaration so a block set that predates declared categories still groups sensibly.
 */
export function toDerivedCategory(registry: Registry, name: string): string {
  const slots = registry.get(name)?.slots ?? {};
  return Object.keys(slots).length > 0 ? "Layout" : "Content";
}
