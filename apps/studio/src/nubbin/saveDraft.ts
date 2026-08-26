import { type Artifact, type DocumentVersion, NubbinError, type NubbinIssue } from "@nubbin/core";
import { compileVersion } from "./compileVersion";
import { draftFilePath } from "./draftFilePath";
import { draftRevision } from "./draftRevision";
import { readDraft } from "./readDraft";
import { writeDraftFile } from "./writeDraftFile";

/** What could not be found for a save that named it: the route's draft. A value rather
 * than a throw because it names a client fault the endpoint answers for. */
export type DraftSaveRejection = { missing: "draft" };
export type DraftSaveConflict = {
  conflict: "draft";
  revision: string;
  version: DocumentVersion;
};
export type DraftSaveSuccess = {
  saved: "draft";
  revision: string;
  artifact?: Artifact;
  issues?: readonly NubbinIssue[];
};

/**
 * The commit half of a whole-document save: write the version to the route's draft file,
 * then compile it. The write comes first and is kept regardless — a draft may hold invalid
 * values indefinitely, because publish is the gate — so a compile refusal reaches the
 * caller as the thrown `NubbinError` with the draft already on disk. The route is checked
 * against the drafts the studio edits, the same judgment `commitDraftEdit` makes: a save
 * naming a route no fixture covers is the client's fault, not a new page.
 */
export function saveDraft(
  route: string,
  version: DocumentVersion,
  expectedRevision: string,
): DraftSaveSuccess | DraftSaveConflict | DraftSaveRejection {
  const current = readDraft(route);
  if (current === undefined) {
    return { missing: "draft" };
  }
  const currentRevision = draftRevision(current);
  if (currentRevision !== expectedRevision) {
    return { conflict: "draft", revision: currentRevision, version: current };
  }
  writeDraftFile(draftFilePath(route), version);
  const revision = draftRevision(version);
  try {
    return { saved: "draft", revision, artifact: compileVersion(version, route) };
  } catch (error) {
    if (error instanceof NubbinError) {
      return { saved: "draft", revision, issues: error.issues };
    }
    throw error;
  }
}
