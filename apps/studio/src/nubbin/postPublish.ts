import { parsePublishRefusal } from "./parsePublishRefusal";
import { parsePublishSuccess } from "./parsePublishSuccess";
import type { PublishOutcome } from "./publishOutcome.types";

/** The client half of a publish: the route posted form-encoded to the studio's publish
 * endpoint, asking for JSON — the same endpoint the preview page's no-JavaScript form posts,
 * which gets the redirect instead. Success carries the new hash and the live page's URL,
 * both built server-side; any refusal comes back as issues for the editor to translate. */
export async function postPublish(route: string): Promise<PublishOutcome> {
  const body = new URLSearchParams({ route });
  const response = await fetch("/api/publish", {
    method: "POST",
    headers: { accept: "application/json" },
    body,
  });
  const text = await response.text();
  return response.ok
    ? parsePublishSuccess(route, text)
    : parsePublishRefusal(response.status, text);
}
