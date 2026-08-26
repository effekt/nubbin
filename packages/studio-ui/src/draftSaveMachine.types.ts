import type { DocumentConflict, DocumentVersion } from "@nubbin/core";
import type { AuthorIssue } from "@nubbin/studio";

/** Side effects emitted by the transport-independent draft save state machine. */
export interface DraftSaveMachineCallbacks {
  readonly reconciled: (version: DocumentVersion) => void;
  readonly conflicts: (conflicts: readonly DocumentConflict[]) => void;
  readonly saved: (issues: readonly AuthorIssue[]) => void;
  readonly failed: () => void;
}
