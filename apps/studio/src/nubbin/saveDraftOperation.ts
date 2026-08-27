import type { SaveDraftOperation } from "@nubbin/studio";
import { saveDraft } from "./saveDraft";

/** Adapts the reference host's filesystem result to Studio's public save contract. */
export const saveDraftOperation: SaveDraftOperation = ({ route, version, expectedRevision }) => {
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
};
