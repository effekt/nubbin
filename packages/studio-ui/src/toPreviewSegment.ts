import type { EditorStatus } from "@nubbin/studio";
import type { StatusSegment } from "./statusSegment.types";

/**
 * The status bar's preview segment, only from what the editor status can prove: a
 * draft-save round trip that failed outright means the preview cannot be reached; a
 * preview frame that handed over its document, with no failed save since, means it is
 * connected. Before either has happened there is no claim to make, so no segment.
 */
export function toPreviewSegment(status: EditorStatus): StatusSegment | undefined {
  if (status.saveFailed === true) {
    return { kind: "amber", text: "Preview unreachable" };
  }
  if (status.frameLoaded === true) {
    return { kind: "ok", text: "Preview connected" };
  }
  return undefined;
}
