import type { DocumentVersion } from "@nubbin/core";
import { parseMatchKind } from "@nubbin/core";
import { blankDraft } from "./blankDraft";
import { draftFilePath } from "./draftFilePath";
import { readDraft } from "./readDraft";
import { writeDraftFile } from "./writeDraftFile";

/** What already stood where a create pointed: the route's draft or fixture. A value rather
 * than a throw because it names a conflict the endpoint answers for. */
export type DraftCreateRejection = { exists: "draft" };

/**
 * The commit half of creating a page: judge the route, refuse one the studio already
 * edits, and write a blank draft for it. The route's judge is core's — `parseMatchKind`
 * runs `assertValidRoute` and throws the `NubbinError` whose message the endpoint answers
 * with, so the studio accepts exactly what publish will accept and no second parser can
 * disagree. From here the new page is an ordinary draft: `/edit` reads it, saves land on
 * it, and publish stays the gate.
 */
export function createDraft(route: string): DocumentVersion | DraftCreateRejection {
  parseMatchKind(route);
  if (readDraft(route) !== undefined) {
    return { exists: "draft" };
  }
  const version = blankDraft(route);
  writeDraftFile(draftFilePath(route), version);
  return version;
}
