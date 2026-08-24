import type { PaletteBlock } from "./paletteGroup.types";

/**
 * Whether one palette block survives the search: a case-insensitive substring match against
 * its name or its description. A blank query — empty or whitespace — keeps every block, so
 * the palette at rest is the full list.
 */
export function isBlockMatch(query: string, block: PaletteBlock): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return true;
  }
  return (
    block.name.toLowerCase().includes(needle) ||
    (block.description?.toLowerCase().includes(needle) ?? false)
  );
}
