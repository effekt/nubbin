import type { HistoryReply } from "@nubbin/studio";
import { parseHistoryReply } from "./parseHistoryReply";
import { prefixedRoute } from "./prefixedRoute";

/**
 * The client half of the history panel: the route's moves fetched from the studio's history
 * endpoint. `undefined` for a reply that is not ok or not the contract's shape, so the panel
 * reports a failed load rather than rendering rows nothing vouched for.
 */
export async function getHistory(route: string): Promise<HistoryReply | undefined> {
  const response = await fetch(prefixedRoute("/api/history", route)).catch(() => undefined);
  if (response === undefined || !response.ok) {
    return undefined;
  }
  return parseHistoryReply(await response.text());
}
