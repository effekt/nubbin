import { resolveHintPaths } from "./adapters/resolveHintPaths";
import { assertDataHintAddressable } from "./assertDataHintAddressable";
import { assertValidDefaults } from "./assertValidDefaults";
import type { Catalog, CatalogEntry } from "./catalog.types";

/**
 * Declares the catalog — the component-free half of a block set, holding each block's schema,
 * its editing hints and its defaults. Entries come back unchanged once every hint path and every
 * set of defaults has been checked against the schema it belongs to.
 *
 * @param entries - Keyed by block name, matching the names `createRegistry` resolves. An entry
 *   carrying only `schema` is stored as-is; `ui.fields` and `defaults` are each checked only when
 *   present. Hint paths are read through the schema's own Standard JSON Schema converter, so an
 *   entry with `ui.fields` needs a schema that exposes one.
 * @returns The same object, typed `Catalog`.
 * @throws {NubbinError} `hint-path-unresolvable` when a `ui.fields` key names a path the schema
 *   does not define, naming the block, every unresolved path, and the paths the schema does
 *   define.
 * @throws {NubbinError} `hint-not-addressable` when a `data` hint sits on a path containing `[]`,
 *   or when two `data` hints on one block nest — `cta` and `cta.label` write one value with no
 *   defined order.
 * @throws {NubbinError} `no-json-schema` when an entry carrying `ui.fields` has a schema without
 *   the Standard JSON Schema converter (Standard Schema spec 1.1).
 * @throws {NubbinError} `invalid-defaults` when `defaults` fail their entry's schema, carrying
 *   every failing path and its message.
 * @throws {NubbinError} `not-standard-schema` when an entry carrying `defaults` has a schema
 *   without `~standard.validate`, or one that validates asynchronously.
 * @throws {Error} From the schema's own JSON Schema converter, when a field has a type JSON
 *   Schema cannot express — the converter runs with `unrepresentable: "throw"`.
 * @example
 * ```ts
 * import { defineCatalog } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const liveBandSchema = z.object({
 *   label: z.string(),
 *   items: z.array(z.object({ text: z.string(), at: z.string() })),
 * });
 *
 * export const catalog = defineCatalog({
 *   LiveBand: {
 *     schema: liveBandSchema,
 *     defaults: { label: "On now", items: [] },
 *     ui: { fields: { items: { data: { revalidate: 60 } } } },
 *   },
 * });
 * ```
 */
export function defineCatalog(entries: Record<string, CatalogEntry>): Catalog {
  // The serializable half of the catalog/registry split: schema, ui, defaults, docs — no
  // components. Everything checkable at registration is checked here, because a bad hint or
  // bad defaults are silent at every later point.
  for (const [blockName, entry] of Object.entries(entries)) {
    if (entry.ui?.fields !== undefined) {
      resolveHintPaths(blockName, entry.schema, entry.ui.fields);
      assertDataHintAddressable(blockName, entry.ui.fields);
    }
    if (entry.defaults !== undefined) {
      assertValidDefaults(blockName, entry.schema, entry.defaults);
    }
  }
  return entries;
}
