import { createDraftSaveRequestHandler } from "@nubbin/studio";
import { saveDraft } from "../../../nubbin/saveDraft";

/**
 * One whole-document save. The editor is controlled, so the draft must hold exactly what
 * the author sees: the version is written before it is judged, and a compile refusal
 * answers 200 with `{ ok: false, issues }` — the save succeeded, the report is the payload,
 * and publish is the gate. Unauthenticated like the publish route: the studio deploys
 * behind the consumer's own gate.
 *
 * An unknown route is 400 like a malformed body — the same client fault, a save naming a
 * route the drafts do not hold.
 */
export const POST = createDraftSaveRequestHandler(({ route, version, expectedRevision }) => {
  const result = saveDraft(route, version, expectedRevision);
  if ("missing" in result) return { status: "missing" };
  if ("conflict" in result) {
    return {
      status: "conflict",
      revision: result.revision,
      version: result.version,
    };
  }
  return {
    status: "saved",
    revision: result.revision,
    ...(result.issues === undefined ? {} : { issues: result.issues }),
  };
});
