import type { PaletteGroup } from "./paletteGroup.types";

/** Each block's icon name keyed by block name, flattened from the palette's groups — so
 * the outline draws the same glyph beside a block that the palette does. */
export function toIconByBlock(groups: readonly PaletteGroup[]): Record<string, string> {
  const icons: Record<string, string> = {};
  for (const group of groups) {
    for (const block of group.blocks) {
      if (block.icon !== undefined) {
        icons[block.name] = block.icon;
      }
    }
  }
  return icons;
}
