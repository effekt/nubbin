import type { DocumentVersion } from "@nubbin/core";
import { parseDraftSaveReply } from "./parseDraftSaveReply";

/** The client half of a whole-document save: the folded draft posted to the studio's draft
 * endpoint. Resolves to `undefined` when the save compiled clean, or to the lines the editor
 * shows — the compiler's issues on a 200, the endpoint's own refusal text otherwise. The
 * draft is written before it is judged, so issues never mean the edit was lost. */
export async function postDraftSave(
  route: string,
  version: DocumentVersion,
): Promise<readonly string[] | undefined> {
  const response = await fetch("/api/draft", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ route, version }),
  });
  if (!response.ok) {
    const text = await response.text();
    return [text === "" ? `save rejected (${response.status})` : text];
  }
  return parseDraftSaveReply(await response.json().catch(() => undefined));
}
