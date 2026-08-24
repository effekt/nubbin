import type { UnknownProps } from "./block.types";

/**
 * How a field's value resolves at render. Absent means static — the value freezes into props.
 * Present, it is left out of the compiled props and copied into the node's `holes` instead, for
 * the consumer's resolver to fill on each render.
 *
 * @example
 * ```ts
 * import type { FieldHintData } from "@nubbin/core";
 *
 * const hourly: FieldHintData = { revalidate: 3600 };
 * ```
 */
export type FieldHintData = {
  /** Seconds a resolved value may be reused before the resolver is asked for it again. */
  revalidate: number;
};

// Studio treatment for one schema path. `core` reads exactly one key — how the field resolves.
/**
 * How an editing surface should treat one field of a block's schema. `core` reads `data` and
 * decides nothing else about the field.
 *
 * @example
 * ```ts
 * import type { FieldHint } from "@nubbin/core";
 *
 * const live: FieldHint = { data: { revalidate: 5 } };
 * const frozen: FieldHint = {};
 * ```
 */
export interface FieldHint {
  /**
   * Marks the field as resolved at render rather than frozen at compile. Legal only on a path
   * addressing a single value — a path containing `[]`, or one nesting inside another `data`
   * path, fails registration.
   */
  data?: FieldHintData;
  /**
   * Names the control an editing surface renders for the field — `"link"` for a string holding
   * a destination. Core validates the path and reads nothing else: an unrecognised name falls
   * back to the field's kind, so a hint never breaks an editor that predates it.
   */
  control?: string;
}

/**
 * The editing half of a catalog entry: how the studio should treat this block's fields.
 *
 * @example
 * ```ts
 * import type { BlockUi } from "@nubbin/core";
 *
 * const ui: BlockUi = { fields: { "cta.label": { data: { revalidate: 60 } } } };
 * ```
 */
export interface BlockUi {
  /**
   * Keyed by schema path (`title`, `cta.label`, `items[].icon`). Unresolvable paths fail
   * registration, read through the schema's own JSON Schema converter rather than a validator.
   */
  fields?: Record<string, FieldHint>;
}

/**
 * One block's registration data with no component attached — schema, editing hints and defaults.
 * Serializable data only: what the studio and CI read. Components live in the registry.
 *
 * @example
 * ```ts
 * import type { CatalogEntry } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const hero: CatalogEntry = {
 *   schema: z.object({ title: z.string() }),
 *   defaults: { title: "Headline" },
 *   ui: { fields: { title: {} } },
 * };
 * ```
 */
export interface CatalogEntry {
  // Typed `unknown` rather than `StandardSchemaV1` because the capability actually required —
  // the JSON Schema converter — is narrower than the validation interface, and the runtime
  // check happens either way.
  /**
   * The block's schema, the same one its `Block` carries. It is judged at registration rather
   * than by the type: props and defaults run through `~standard.validate`, and hint paths are
   * read through `~standard.jsonSchema`.
   */
  schema: unknown;
  /**
   * One line saying what the block is for, shown wherever an editing surface lists blocks. The
   * serializable twin of `Block.description`, for a studio that fetches the catalog without the
   * components. Compile never reads it.
   */
  description?: string;
  /**
   * A single glyph shown beside the name wherever an editing surface lists blocks. The
   * serializable twin of `Block.icon` — a string, never a component. Compile never reads it.
   */
  icon?: string;
  /**
   * Opaque links keyed by destination, the serializable twin of `Block.docs`. An editing surface
   * renders each as "Open in {Key}"; the consumer supplies the URLs. Compile never reads it.
   */
  docs?: Record<string, string>;
  /** Editing hints, keyed by schema path. Omit it and every field is treated as static. */
  ui?: BlockUi;
  /**
   * What a freshly dropped block renders with. Checked against `schema` at registration, because
   * defaults that fail it produce a block invalid the instant it is placed.
   */
  defaults?: UnknownProps;
}

/**
 * Every block a project offers, keyed by the block name the registry resolves — the half a studio
 * or a CI step can fetch, since it holds no components. Build one with `defineCatalog`; the object
 * literal alone runs no checks.
 *
 * @example
 * ```ts
 * import type { Catalog } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const catalog: Catalog = {
 *   Hero: { schema: z.object({ title: z.string() }) },
 * };
 * ```
 */
export type Catalog = Record<string, CatalogEntry>;
