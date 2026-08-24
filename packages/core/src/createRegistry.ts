import { assertSlotAllows } from "./assertSlotAllows";
import type { Block } from "./block.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";
import type { Registry } from "./registry.types";

/**
 * Turns the blocks an app ships into the lookup a renderer resolves nodes through: one name to
 * one block, with every slot `allow` entry checked against the set. Hold the result for the life
 * of the process — it reads a snapshot of the array and never re-reads it.
 *
 * @param blocks - Every block the app renders, each from `defineBlock`. Names must be unique
 *   across the array, and order does not matter: a slot may name a block declared later.
 * @returns A registry resolving a block by name and listing the names it holds, in the order the
 *   blocks were given.
 * @throws {NubbinError} `duplicate-block-name` when two blocks share a name, carrying the name in
 *   `at`.
 * @throws {NubbinError} `slot-allow-unknown` when a slot's `allow` names a block no entry defines.
 *   Every bad entry is reported in one error as `"Name" (Block.slot)`, alongside the names that
 *   are registered — two typos take one round trip, not two.
 * @example
 * ```ts
 * import { createRegistry, defineBlock } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const pageBlock = defineBlock({
 *   name: "Page",
 *   schema: z.object({ title: z.string() }),
 *   component: null,
 *   version: 1,
 *   slots: { items: { allow: ["Testimonial"] } },
 * });
 *
 * const testimonialBlock = defineBlock({
 *   name: "Testimonial",
 *   schema: z.object({ quote: z.string() }),
 *   component: null,
 *   version: 1,
 *   slots: {},
 * });
 *
 * const registry = createRegistry([pageBlock, testimonialBlock]);
 *
 * registry.get("Page")?.name; // "Page"
 * registry.get("Nope"); // undefined
 * registry.names(); // ["Page", "Testimonial"]
 * ```
 */
export function createRegistry(blocks: readonly Block[]): Registry {
  const byName = new Map<string, Block>();
  for (const block of blocks) {
    if (byName.has(block.name)) {
      refuse(
        NubbinIssueCode.DuplicateBlockName,
        `Duplicate block name "${block.name}" — names are the identity nodes resolve through`,
        block.name,
      );
    }
    byName.set(block.name, block);
  }
  // Slot `allow` lists resolve once the whole array is ingested, so a block may name a sibling
  // registered after it.
  assertSlotAllows([...byName.values()]);

  return {
    get: (name) => byName.get(name),
    names: () => [...byName.keys()],
  };
}
