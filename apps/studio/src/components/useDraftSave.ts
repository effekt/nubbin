"use client";

import type { DocumentVersion } from "@nubbin/core";
import studioConfig from "@nubbin/studio-config";
import { postDraftSave } from "../nubbin/postDraftSave";
import { toAuthorIssues } from "../nubbin/toAuthorIssues";
import { patchEditorStatus } from "./patchEditorStatus";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SAVE_DELAY_MS = 500;

/**
 * The editor's debounced draft save: posts the folded version to the draft endpoint, and
 * folds what came back into the editor status — the compiler's issues in author words, and
 * the save's own timestamp, which is what lets the status bar say the draft is autosaved
 * only once it truly is. A round trip that never reaches the endpoint marks the save
 * failed instead, which is the status bar's proof the preview is unreachable.
 */
export function useDraftSave(route: string): (version: DocumentVersion) => void {
  return useDebouncedCallback((version: DocumentVersion) => {
    void postDraftSave(route, version).then(
      (raw) =>
        patchEditorStatus({
          issues: raw === undefined ? [] : toAuthorIssues(raw, studioConfig.catalog, version),
          savedAt: new Date().toISOString(),
          saveFailed: false,
        }),
      () => patchEditorStatus({ saveFailed: true }),
    );
  }, SAVE_DELAY_MS);
}
