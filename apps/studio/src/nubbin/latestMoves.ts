import type { PointerMove } from "@nubbin/core";

const HISTORY_CAP = 20;

/**
 * A route's log turned into what the panel shows: newest first — the store appends, so its
 * order is oldest first — and capped at the last twenty moves. `total` carries the uncapped
 * count, so a payload that trimmed the log says so instead of passing the cap off as the
 * whole history.
 */
export function latestMoves(moves: readonly PointerMove[]): {
  moves: PointerMove[];
  total: number;
} {
  return { moves: moves.slice(-HISTORY_CAP).reverse(), total: moves.length };
}
