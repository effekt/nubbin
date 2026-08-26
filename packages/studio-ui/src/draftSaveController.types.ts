import type { DocumentConflict, DocumentVersion } from "@nubbin/core";

/** Reconciliation state and actions exposed by the autosave controller. */
export interface DraftSaveController {
  readonly save: (version: DocumentVersion) => void;
  readonly conflicts: readonly DocumentConflict[];
  readonly resolve: (index: number, choice: "local" | "remote") => void;
}
