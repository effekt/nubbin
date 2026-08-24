import type { StandardSchemaV1 } from "@standard-schema/spec";
import { assertBlockVersion } from "./assertBlockVersion";
import { assertSlotBounds } from "./assertSlotBounds";
import type { Block } from "./block.types";

/**
 * Declares a block — the name documents resolve through, the schema its props are validated
 * against, the component that renders it, and the slots it accepts children in. The block comes
 * back unchanged, with `Schema` and `Component` pinned at the call site so `InferProps` derives
 * the component's props from the schema.
 *
 * @typeParam Schema - The block's [Standard Schema](https://standardschema.dev). Inferred from
 *   `block.schema`; validation always runs its `~standard.validate`, which must answer
 *   synchronously.
 * @typeParam Component - Whatever the consumer's renderer accepts. `core` never inspects it.
 * @param block - The block to declare. `version` must be an integer of 1 or more, and every slot
 *   declaring both bounds must keep `min` at or below `max`. Names in a slot's `allow` are not
 *   resolved here — `createRegistry` resolves them once every sibling is present.
 * @returns The same object, typed `Block<Schema, Component>`.
 * @throws {NubbinError} `block-version` when `version` is not an integer of 1 or more.
 * @throws {NubbinError} `slot-bounds` when a slot's `min` exceeds its `max`, naming the block and
 *   the slot in `at`.
 * @example
 * ```ts
 * import { defineBlock } from "@nubbin/core";
 * import type { InferProps } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const heroSchema = z.object({
 *   headline: z.string(),
 *   tone: z.enum(["light", "dark"]),
 * });
 *
 * const Hero = (props: InferProps<typeof heroSchema>) => null;
 *
 * export const heroBlock = defineBlock({
 *   name: "Hero",
 *   schema: heroSchema,
 *   component: Hero,
 *   version: 1,
 *   slots: { actions: { allow: ["CtaBanner"], max: 2 } },
 * });
 * ```
 */
export function defineBlock<Schema extends StandardSchemaV1, Component>(
  block: Block<Schema, Component>,
): Block<Schema, Component> {
  // Identity at runtime; its job is to fix the generic parameters at the call site so props are
  // inferred from the schema rather than declared beside it. The checks here are the ones the
  // type system cannot make — a version below 1, or a slot that no composition could satisfy.
  assertBlockVersion(block.name, block.version);
  assertSlotBounds(block.name, block.slots);
  return block;
}
