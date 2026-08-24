import type { Catalog, Registry } from "@nubbin/core";
import type { PaletteGroup } from "./paletteGroup.types";
import { toPuckCategories } from "./toPuckCategories";

/**
 * The palette's sections, from the same pair the Puck config is built from: the categories
 * `toPuckCategories` derives, each block carrying its one-line description. The description
 * is read from the registry's block first and the catalog entry second — the demo writes it
 * beside `defineBlock`, but a studio holding only the serializable half still gets one.
 */
export function toPaletteGroups(catalog: Catalog, registry: Registry): PaletteGroup[] {
  const categories = toPuckCategories(registry, Object.keys(catalog));
  return Object.values(categories).map((category) => ({
    title: category.title ?? "",
    blocks: (category.components ?? []).map((name) => ({
      name,
      description: registry.get(name)?.description ?? catalog[name]?.description,
    })),
  }));
}
