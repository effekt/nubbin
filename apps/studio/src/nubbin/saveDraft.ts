import type { Artifact, DocumentVersion } from "@nubbin/core";
import { compileVersion } from "./compileVersion";
import { draftFilePath } from "./draftFilePath";
import { readDraft } from "./readDraft";
import { writeDraftFile } from "./writeDraftFile";

/** What could not be found for a save that named it: the route's draft. A value rather
 * than a throw because it names a client fault the endpoint answers for. */
export type DraftSaveRejection = { missing: "draft" };

/**
 * The commit half of a whole-document save: write the version to the route's draft file,
 * then compile it. The write comes first and is kept regardless — a draft may hold invalid
 * values indefinitely, because publish is the gate — so a compile refusal reaches the
 * caller as the thrown `NubbinError` with the draft already on disk. The route is checked
 * against the drafts the studio edits, the same judgment `commitDraftEdit` makes: a save
 * naming a route no fixture covers is the client's fault, not a new page.
 */
export function saveDraft(route: string, version: DocumentVersion): Artifact | DraftSaveRejection {
  if (readDraft(route) === undefined) {
    return { missing: "draft" };
  }
  writeDraftFile(draftFilePath(route), version);
  return compileVersion(version, route);
}
