import type { EditorStatus } from "./editorStatus.types";
import { editorStatusStore } from "./editorStatusStore";

/** Folds one partial observation over the current editor status. */
export function patchEditorStatus(patch: Partial<EditorStatus>): void {
  editorStatusStore.set({ ...editorStatusStore.get(), ...patch });
}
