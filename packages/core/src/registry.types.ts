import type { Block } from "./block.types";

/**
 * The resolved block set — what compile and a renderer ask when a node names a block. Build one
 * with `createRegistry`; it holds a snapshot of the array it was given, so adding a block means
 * building a new registry rather than writing into this one.
 *
 * @example
 * ```ts
 * import { createRegistry, defineBlock } from "@nubbin/core";
 * import type { Registry } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const registry: Registry = createRegistry([
 *   defineBlock({
 *     name: "Hero",
 *     schema: z.object({ title: z.string() }),
 *     component: null,
 *     version: 1,
 *     slots: {},
 *   }),
 * ]);
 *
 * const hero = registry.get("Hero");
 * if (hero !== undefined) {
 *   hero.version; // 1
 * }
 * ```
 */
export interface Registry {
  /**
   * Resolves one block by the name a document node carries.
   *
   * @param name - The block name, matched exactly — casing included.
   * @returns The registered block, or `undefined` when nothing carries that name. An unknown name
   *   is a value to handle here; compile is where it becomes an `unknown-block` fault.
   */
  get(name: string): Block | undefined;
  /**
   * Lists what the registry holds — the names a palette or a compatibility check enumerates.
   *
   * @returns Every registered name, in the order the blocks were given to `createRegistry`. A
   *   fresh array each call, so writing to it changes nothing.
   */
  names(): string[];
}
