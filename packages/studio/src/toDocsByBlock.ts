import type { Catalog, Registry } from "@nubbin/core";

/** Projects each catalog block's documentation links for the editor inspector. */
export function toDocsByBlock(
  catalog: Catalog,
  registry: Registry,
): Record<string, Record<string, string>> {
  const byBlock: Record<string, Record<string, string>> = {};
  for (const name of Object.keys(catalog)) {
    const docs = registry.get(name)?.docs ?? catalog[name]?.docs;
    if (docs !== undefined) {
      byBlock[name] = docs;
    }
  }
  return byBlock;
}
