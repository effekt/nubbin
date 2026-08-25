import { createStatusStore } from "./createStatusStore";
import type { EditorStatus } from "./editorStatus.types";

/** The status store shared by Nubbin's editor surface and its chrome. */
export const editorStatusStore = createStatusStore<EditorStatus>({
  issues: [],
  issuesOpen: false,
  published: false,
});
