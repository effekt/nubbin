import { parsePublishRefusal } from "./parsePublishRefusal";
import type { PublishOutcome } from "./publishOutcome.types";

/** The client half of a publish: the route posted form-encoded to the studio's publish
 * endpoint, which is what the preview page's no-JavaScript form already sends. Success is
 * the followed redirect, carrying the new hash in its landing URL; any refusal comes back
 * as issues for the editor to translate. */
export async function postPublish(route: string): Promise<PublishOutcome> {
  const body = new URLSearchParams({ route });
  const response = await fetch("/api/publish", { method: "POST", body });
  if (!response.ok) {
    return parsePublishRefusal(response.status, await response.text());
  }
  const hash = new URL(response.url).searchParams.get("published");
  return hash === null ? { ok: true, route } : { ok: true, route, hash };
}
