import type { Catalog, Registry } from "@nubbin/core";

/**
 * One piece of a block's editor metadata, read from the registry's block first and the catalog
 * entry second — the demo writes it beside `defineBlock`, but a studio holding only the
 * serializable half still gets one. One lookup for every key so the precedence cannot drift
 * between description, icon and category.
 */
export function toBlockMeta(
  catalog: Catalog,
  registry: Registry,
  name: string,
  key: "category" | "description" | "icon",
): string | undefined {
  return registry.get(name)?.[key] ?? catalog[name]?.[key];
}
