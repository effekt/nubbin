import type { PointerMove } from "@nubbin/core";

/**
 * What the history endpoint answers: the hash the route serves right now — `null` before any
 * publish — and its pointer moves, newest first, capped at the last twenty. `moves` is `null`
 * exactly when the store implements no `history(route)`, which is a valid adapter rather than
 * an error; `total` is the uncapped count, so a trimmed list says how much it trimmed.
 */
export interface HistoryReply {
  readonly current: string | null;
  readonly moves: readonly PointerMove[] | null;
  readonly total: number;
}
