"use client";

import type { DocumentConflict, DocumentVersion } from "@nubbin/core";
import { patchEditorStatus } from "@nubbin/studio";
import { useCallback, useMemo, useState } from "react";
import { DraftSaveMachine } from "./DraftSaveMachine";
import type { DraftSaveController } from "./draftSaveController.types";
import type { StudioDraftSaver } from "./studioEditorProps.types";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SAVE_DELAY_MS = 500;

/** Binds the draft save state machine to React state and the shared Studio status. */
export function useDraftSave(
  route: string,
  initialVersion: DocumentVersion,
  initialRevision: string,
  saveDraft: StudioDraftSaver,
  onReconciled: (version: DocumentVersion) => void,
): DraftSaveController {
  const [conflicts, setConflicts] = useState<readonly DocumentConflict[]>([]);
  const machine = useMemo(
    () =>
      new DraftSaveMachine(route, initialVersion, initialRevision, saveDraft, {
        reconciled: onReconciled,
        conflicts: setConflicts,
        saved: (issues) =>
          patchEditorStatus({
            issues,
            savedAt: new Date().toISOString(),
            saveFailed: false,
          }),
        failed: () => patchEditorStatus({ saveFailed: true }),
      }),
    [initialRevision, initialVersion, onReconciled, route, saveDraft],
  );
  const flush = useDebouncedCallback(() => void machine.flush(), SAVE_DELAY_MS);
  const save = useCallback(
    (version: DocumentVersion) => {
      machine.queue(version);
      flush();
    },
    [flush, machine],
  );
  const resolve = useCallback(
    (index: number, choice: "local" | "remote") => machine.resolve(index, choice),
    [machine],
  );
  return { save, conflicts, resolve };
}
