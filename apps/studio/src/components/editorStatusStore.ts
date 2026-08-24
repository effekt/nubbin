import { createStatusStore } from "./createStatusStore";
import type { EditorStatus } from "./editorStatus.types";

/**
 * The one store the editor writes and the header chrome reads. A module singleton on
 * purpose: the editor and the header are separate subtrees under Puck's stable overrides,
 * and this seam is what lets the pill's count and the publish label change without a new
 * overrides object. The editor resets it on mount, so a client-side route switch never
 * carries one draft's issues into the next.
 */
export const editorStatusStore = createStatusStore<EditorStatus>({
  issues: [],
  issuesOpen: false,
  published: false,
});
