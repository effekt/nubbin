import type { EditorStatus } from "@nubbin/studio";
import type { StatusSegment } from "./statusSegment.types";
import { toPreviewSegment } from "./toPreviewSegment";

/**
 * What the status bar may truthfully say, from what the editor status can prove: a publish
 * that landed this session reads up to date; anything else reads as edits not yet live —
 * the same assumption the publish button makes. Issues add the fix count only while there
 * are any. The autosave note appears only after a save has actually reached the endpoint,
 * saying "just now" until the caller reports the stamp stale, and clearing the moment
 * another edit is typed. The preview segment speaks only once the frame or a save round
 * trip has proven something either way.
 */
export function toStatusSegments(
  status: EditorStatus,
  saveStale: boolean,
): {
  left: StatusSegment[];
  right: StatusSegment[];
} {
  const left: StatusSegment[] = [
    status.published
      ? { kind: "ok", text: "Published · up to date" }
      : { kind: "amber", text: "Newer edits not live yet" },
  ];
  if (status.issues.length > 0) {
    left.push({ kind: "fix", text: `${status.issues.length} to fix before publish` });
  }
  const right: StatusSegment[] = [];
  if (status.savedAt !== undefined) {
    right.push({ kind: "plain", text: saveStale ? "Autosaved" : "Autosaved just now" });
  }
  const preview = toPreviewSegment(status);
  if (preview !== undefined) {
    right.push(preview);
  }
  return { left, right };
}
