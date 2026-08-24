import { endpointFor } from "./endpointFor";
import { UsageError } from "./UsageError";

/**
 * Moves a pointer through a running application rather than from here.
 *
 * A framework's cache is invalidated by the process that serves it: publishing straight into the
 * store while a server is up moves the pointer and leaves that server serving its cached page, so
 * the store and the site disagree until a restart. The application exposes the two route handlers
 * `@nubbin/next` ships, and this posts to them.
 */
export async function publishThroughOrigin(
  origin: string,
  action: "publish" | "unpublish",
  body: Record<string, string>,
): Promise<void> {
  const endpoint = endpointFor(origin, action);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {
    // An origin nothing answers on is the same mistake as one that answers 404 — a wrong URL, or
    // a server that is not up — so it exits the same way rather than as a raw network error.
    throw new UsageError(`${endpoint} could not be reached — is the application running?`);
  });
  if (!response.ok) {
    throw new UsageError(`${endpoint} answered ${response.status} — is the application running?`);
  }
}
