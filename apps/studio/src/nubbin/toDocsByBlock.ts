import type { Catalog, Registry } from "@nubbin/core";

/**
 * Every block's docs links, keyed by block name, from the same pair the palette is built
 * from. Links are read from the registry's block first and the catalog entry second — the
 * demo writes them beside `defineBlock`, but a studio holding only the serializable half
 * still gets them. A block declaring none is absent, so the inspector renders nothing for it.
 */
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
