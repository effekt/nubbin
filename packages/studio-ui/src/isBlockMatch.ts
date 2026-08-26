import type { PaletteBlock } from "@nubbin/studio";

/** Whether a palette block matches a case-insensitive name or description query. */
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
