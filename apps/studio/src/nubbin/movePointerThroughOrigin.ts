import { consumerOrigin } from "./consumerOrigin";

/**
 * Asks the consumer's application to point `route` at `hash`, via the `api/nubbin/publish`
 * handler `@nubbin/next` ships. The pointer has to move inside the process that serves the
 * page — moved from here, that process keeps answering from its cache and the store and the
 * site disagree until it restarts. A refusal or an unreachable origin throws naming the
 * endpoint, because a publish that half-happened is worse than one that failed.
 */
export async function movePointerThroughOrigin(route: string, hash: string): Promise<void> {
  const endpoint = new URL("api/nubbin/publish", `${consumerOrigin()}/`);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ route, hash }),
  }).catch(() => undefined);
  if (response === undefined || !response.ok) {
    const answer = response === undefined ? "could not be reached" : `answered ${response.status}`;
    throw new Error(`${endpoint} ${answer} — is the application running?`);
  }
}
