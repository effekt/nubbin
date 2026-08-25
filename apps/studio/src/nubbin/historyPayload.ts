import type { ArtifactStore } from "@nubbin/core";
import type { HistoryReply } from "@nubbin/studio";
import { latestMoves } from "./latestMoves";

/**
 * One route's history as the endpoint answers it. `history` is optional on `ArtifactStore`,
 * so a store without it is a valid adapter — that absence answers as `moves: null` for the
 * panel to name honestly, never as a crash on an absent method.
 */
export async function historyPayload(store: ArtifactStore, route: string): Promise<HistoryReply> {
  const current = (await store.pointer(route))?.hash ?? null;
  const log = await store.history?.(route);
  if (log === undefined) {
    return { current, moves: null, total: 0 };
  }
  const { moves, total } = latestMoves(log);
  return { current, moves, total };
}
