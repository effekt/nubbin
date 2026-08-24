import type { PointerMove } from "@nubbin/core";

/**
 * One move as one line: the hash first because it is what `rollback` takes, then the document
 * version because it is what `--to` resolves by, then when the move went live.
 */
export function formatMove(move: PointerMove): string {
  return `${move.hash} (document v${move.documentVersion}, moved ${move.movedAt})`;
}
