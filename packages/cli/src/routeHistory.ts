import type { PointerMove } from "@nubbin/core";
import type { NubbinConfig } from "./config.types";
import { UsageError } from "./UsageError";

/**
 * The route's history, from a store that may not keep one — `history` is optional on
 * `ArtifactStore`, so a store without it is a valid adapter and its absence is answered by
 * naming the store as the gap, never by a crash on an absent method. `wanted` says what the
 * caller needed the history for, so the refusal reads as advice.
 */
export async function routeHistory(
  config: NubbinConfig,
  route: string,
  wanted: string,
): Promise<PointerMove[]> {
  const moves = await config.store.history?.(route);
  if (moves === undefined) {
    throw new UsageError(`the store in nubbin.config implements no history(route), so ${wanted}`);
  }
  return moves;
}
