"use client";

import type { DocumentVersion } from "@nubbin/core";
import { patchEditorStatus } from "./patchEditorStatus";
import type { StudioDraftSaver } from "./studioEditorProps.types";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SAVE_DELAY_MS = 500;

/**
 * The editor's debounced draft save: posts the folded version to the draft endpoint, and
 * folds what came back into the editor status — the compiler's issues in author words, and
 * the save's own timestamp, which is what lets the status bar say the draft is autosaved
 * only once it truly is. A round trip that never reaches the endpoint marks the save
 * failed instead, which is the status bar's proof the preview is unreachable.
 */
export function useDraftSave(
  route: string,
  saveDraft: StudioDraftSaver,
): (version: DocumentVersion) => void {
  return useDebouncedCallback((version: DocumentVersion) => {
    void saveDraft(route, version).then(
      (issues) =>
        patchEditorStatus({
          issues: issues ?? [],
          savedAt: new Date().toISOString(),
          saveFailed: false,
        }),
      () => patchEditorStatus({ saveFailed: true }),
    );
  }, SAVE_DELAY_MS);
}
