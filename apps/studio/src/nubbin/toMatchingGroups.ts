import { isBlockMatch } from "./isBlockMatch";
import type { PaletteGroup } from "./paletteGroup.types";

/**
 * The palette's groups narrowed to a search: each group keeps only the blocks the query
 * matches, and a group with nothing left is dropped rather than shown as an empty header.
 * An empty result across every group is the caller's cue for the no-matches state.
 */
export function toMatchingGroups(query: string, groups: readonly PaletteGroup[]): PaletteGroup[] {
  return groups
    .map((group) => ({
      ...group,
      blocks: group.blocks.filter((block) => isBlockMatch(query, block)),
    }))
    .filter((group) => group.blocks.length > 0);
}
