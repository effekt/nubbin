import { parsePublishRefusal } from "./parsePublishRefusal";
import { parsePublishSuccess } from "./parsePublishSuccess";
import type { PublishOutcome } from "./publishOutcome.types";

/**
 * The client half of a rollback: the route and target hash posted as JSON to the studio's
 * rollback endpoint. The reply speaks publish's contract — `{ok: true, hash, url}` when the
 * pointer moved, issues when drift or a missing artifact refused it — so the same parsers
 * carry it into the same outcome flow.
 */
export async function postRollback(route: string, hash: string): Promise<PublishOutcome> {
  const response = await fetch("/api/rollback", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ route, hash }),
  });
  const text = await response.text();
  return response.ok
    ? parsePublishSuccess(route, text)
    : parsePublishRefusal(response.status, text);
}
