"use client";

import type { DocumentVersion } from "@nubbin/core";
import { patchEditorStatus } from "@nubbin/studio";
import type { StudioDraftSaver } from "./studioEditorProps.types";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SAVE_DELAY_MS = 500;

/** Debounces draft persistence and reflects its result in shared editor status. */
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
