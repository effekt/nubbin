import type { Catalog, Registry } from "@nubbin/core";
import type { PaletteBlock, PaletteGroup } from "./paletteGroup.types";
import { toBlockMeta } from "./toBlockMeta";
import { toDerivedCategory } from "./toDerivedCategory";
import { toPaletteBlock } from "./toPaletteBlock";

/**
 * The palette's sections: blocks group under the category each one declares, sections ordered
 * by first appearance in the catalog — the consumer curates the palette by ordering their
 * catalog, so no editorial order lives here. A block declaring no category files under the
 * derived Content/Layout fallback, and those sections sort after every declared one; a
 * fallback title matching a declared one joins that section, so titles stay unique — they are
 * the keys collapse state and section rendering hang off.
 */
export function toPaletteGroups(catalog: Catalog, registry: Registry): PaletteGroup[] {
  const filed = Object.keys(catalog).map((name) => ({
    name,
    declared: toBlockMeta(catalog, registry, name, "category"),
  }));
  const ordered = [
    ...filed.filter((entry) => entry.declared !== undefined),
    ...filed.filter((entry) => entry.declared === undefined),
  ];
  const groups = new Map<string, PaletteBlock[]>();
  for (const { name, declared } of ordered) {
    const title = declared ?? toDerivedCategory(registry, name);
    const blocks = groups.get(title) ?? [];
    blocks.push(toPaletteBlock(catalog, registry, name));
    groups.set(title, blocks);
  }
  return [...groups].map(([title, blocks]) => ({ title, blocks }));
}
