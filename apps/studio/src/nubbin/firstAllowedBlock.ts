import type { Registry, SlotConstraint } from "@nubbin/core";

/** The block a preview fills a required slot with: the first `allow` entry the registry
 * resolves, or the first registered block when the slot is open. `undefined` only when the
 * allow list names nothing registered — impossible for a registry `createRegistry` built,
 * but this function takes the constraint at its word rather than assuming its provenance. */
export function firstAllowedBlock(
  constraint: SlotConstraint,
  registry: Registry,
): string | undefined {
  const candidates = constraint.allow ?? registry.names();
  return candidates.find((name) => registry.get(name) !== undefined);
}
