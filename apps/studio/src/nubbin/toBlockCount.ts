import type { PaletteGroup } from "./paletteGroup.types";

/** How many blocks the palette holds across every group — the number the search field's
 * placeholder quotes, counted from the unfiltered catalog so it never shrinks mid-search. */
export function toBlockCount(groups: readonly PaletteGroup[]): number {
  return groups.reduce((count, group) => count + group.blocks.length, 0);
}
