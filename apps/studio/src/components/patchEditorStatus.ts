import type { EditorStatus } from "./editorStatus.types";
import { editorStatusStore } from "./editorStatusStore";

/**
 * One partial write to the editor status: whatever a caller learned — a save's issues, a
 * refusal that should open the dropdown, a publish that landed — folded over what the store
 * already holds, so no writer has to know the fields it is not reporting on.
 */
export function patchEditorStatus(patch: Partial<EditorStatus>): void {
  editorStatusStore.set({ ...editorStatusStore.get(), ...patch });
}
