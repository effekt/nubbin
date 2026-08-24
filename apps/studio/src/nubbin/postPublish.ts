/** The client half of a publish: the route posted form-encoded to the studio's publish
 * endpoint, which is what the preview page's no-JavaScript form already sends. The endpoint
 * answers with a redirect back to the preview carrying the new hash, so the message names it
 * when the followed redirect does. Resolves to the line the editor shows either way. */
export async function postPublish(route: string): Promise<string> {
  const body = new URLSearchParams({ route });
  const response = await fetch("/api/publish", { method: "POST", body });
  if (!response.ok) {
    const text = await response.text();
    return text === "" ? `publish rejected (${response.status})` : text;
  }
  const hash = new URL(response.url).searchParams.get("published");
  return hash === null ? "published" : `published ${hash}`;
}
