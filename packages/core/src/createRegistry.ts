import { assertSlotAllows } from "./assertSlotAllows";
import type { Block } from "./block.types";
import type { Registry } from "./registry.types";

/**
 * Slot `allow` lists resolve once the whole array is ingested, so a block may name a sibling
 * registered after it.
 */
export function createRegistry(blocks: readonly Block[]): Registry {
  const byName = new Map<string, Block>();
  for (const block of blocks) {
    if (byName.has(block.name)) {
      throw new Error(
        `Duplicate block name "${block.name}" — names are the identity nodes resolve through`,
      );
    }
    byName.set(block.name, block);
  }
  assertSlotAllows([...byName.values()]);

  return {
    get: (name) => byName.get(name),
    names: () => [...byName.keys()],
  };
}
