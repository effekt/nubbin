import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Props as they stand before validation — what a document node carries and what a document
 * operation writes. Every value is `unknown` until the block's schema has judged it.
 *
 * @example
 * ```ts
 * import type { UnknownProps } from "@nubbin/core";
 *
 * const draft: UnknownProps = { title: "Launch", tone: "light" };
 * ```
 */
export type UnknownProps = Record<string, unknown>;

// A block's props, derived from its schema. The whole of invariant 1 in one type: there is no
// second definition of a block's shape, so nothing can drift from it.
//
// `InferOutput` rather than `InferInput` because a component receives what `validate()`
// returned — compile freezes the validated value, so a field a transform reshaped reaches the
// component in its output form, not as the author typed it.
/**
 * The props a block's component receives — the output side of its schema, as `validate()`
 * returned it. Type the component with this instead of writing an interface beside the schema:
 * a field a transform reshaped arrives in its transformed form, not as the author typed it.
 *
 * @typeParam Schema - The block's schema. Pass `typeof mySchema`.
 * @example
 * ```ts
 * import type { InferProps } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const heroSchema = z.object({
 *   headline: z.string(),
 *   tone: z.enum(["light", "dark"]),
 * });
 *
 * type HeroProps = InferProps<typeof heroSchema>;
 * // { headline: string; tone: "light" | "dark" }
 *
 * const Hero = ({ headline, tone }: HeroProps) => null;
 * ```
 */
export type InferProps<Schema extends StandardSchemaV1> = StandardSchemaV1.InferOutput<Schema>;

/**
 * What one slot accepts: which blocks may sit in it, and how many. `allow` is checked twice —
 * its entries must name registered blocks, and every child a document puts here must be one of
 * them. The bounds are checked when a document compiles.
 *
 * @example
 * ```ts
 * import type { SlotConstraint } from "@nubbin/core";
 *
 * const items: SlotConstraint = { allow: ["Card"], min: 1, max: 4 };
 * const anything: SlotConstraint = {};
 * ```
 */
export interface SlotConstraint {
  /**
   * Block names permitted here, each resolved at registration. Omitted means any registered
   * block. An entry naming no registered block fails `createRegistry` rather than silently
   * rejecting every child; a child a listed name does not cover is a compile fault
   * (`slot-not-allowed`).
   */
  allow?: readonly string[];
  /**
   * Fewest children the slot must hold, checked at compile (`slot-min`). A declared slot the
   * document never mentions counts as holding zero, so a `min` is enforced there too.
   */
  min?: number;
  /**
   * Most children the slot may hold, checked at compile (`slot-max`). `defineBlock` refuses a
   * `min` above it.
   */
  max?: number;
}

/**
 * One block as registered: the name documents resolve through, the schema its props are judged
 * against, the component that renders it, and the slots it accepts children in. Build one with
 * `defineBlock` rather than by hand — the object literal alone runs no checks.
 *
 * @typeParam Schema - The block's [Standard Schema](https://standardschema.dev).
 * @typeParam Component - Whatever the consumer's renderer accepts.
 * @example
 * ```ts
 * import type { Block } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const cardSchema = z.object({ title: z.string() });
 *
 * const card: Block<typeof cardSchema, null> = {
 *   name: "Card",
 *   schema: cardSchema,
 *   component: null,
 *   version: 2,
 *   slots: {},
 * };
 * ```
 */
export interface Block<Schema extends StandardSchemaV1 = StandardSchemaV1, Component = unknown> {
  /**
   * Stable identity, referenced by every node. Renaming it is a migration. Unique across a
   * registry — two blocks sharing a name are refused.
   */
  name: string;
  /**
   * One line saying what the block is for, shown wherever an editing surface lists blocks.
   * Editor metadata with the same standing as editing hints: it sits beside the schema, never
   * inside it, and compile never reads it — no artifact carries a description.
   */
  description?: string;
  /**
   * A single glyph — an emoji or short string the consumer chooses — shown beside the name
   * wherever an editing surface lists blocks. A string rather than a component, so `core` stays
   * render-agnostic. Editor metadata like `description`: compile never reads it.
   */
  icon?: string;
  /**
   * Opaque links keyed by destination — `docs: { figma: "…", storybook: "…" }` — that an editing
   * surface renders as "Open in {Key}" for the selected block. Nubbin never inspects a URL or
   * knows what is behind it; the consumer supplies them. Compile never reads it.
   */
  docs?: Record<string, string>;
  /**
   * The schema props are validated against, through its own `~standard.validate`. It must answer
   * synchronously; compile refuses a schema that returns a promise.
   */
  schema: Schema;
  // Generic so core never imports a rendering library.
  /**
   * What renders this block. `core` neither calls nor inspects it, which is why the component
   * lives in the registry and never in the serializable catalog. `@nubbin/react` narrows it to a
   * component type.
   */
  component: Component;
  /**
   * Bumped when the schema changes incompatibly. An integer of 1 or more, stamped into the
   * `blockVersions` of every artifact whose document uses the block — which is what
   * `checkRollback` compares a stored artifact against.
   */
  version: number;
  /**
   * Slot constraints keyed by slot name. A slot the document fills but the block does not declare
   * is a compile error (`slot-not-allowed`).
   */
  slots: Record<string, SlotConstraint>;
}
