import type { Catalog } from "@nubbin/core";

/**
 * The `data`-hinted field a path would write into, or `undefined` when the write touches none.
 * Overlap in either direction counts, the same reading `assertDataHintAddressable` gives two
 * hints: a write under the hinted path lands inside the hole, and a write above it replaces the
 * object the hole is carved from.
 */
export function dataHintAt(catalog: Catalog, block: string, path: string): string | undefined {
  const fields = catalog[block]?.ui?.fields ?? {};
  return Object.keys(fields).find(
    (hinted) =>
      fields[hinted]?.data !== undefined &&
      (hinted === path || path.startsWith(`${hinted}.`) || hinted.startsWith(`${path}.`)),
  );
}
