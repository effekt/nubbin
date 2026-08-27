import type { DocumentVersion } from "@nubbin/core";
import type { DraftRevision } from "../draftRevision.types";
import type { SaveDraftOperation } from "../saveDraftOperation.types";

/** One isolated host state used by the executable draft-save contract. */
export interface DraftSaveContractHarness {
  /** The host callback under test. */
  readonly saveDraft: SaveDraftOperation;
  /** A route whose draft begins at `version` and `revision`. */
  readonly route: string;
  /** A route the host does not hold. */
  readonly missingRoute: string;
  /** The initial draft at `route`. */
  readonly version: DocumentVersion;
  /** The opaque identity of `version`. */
  readonly revision: DraftRevision;
}

/** Creates fresh state for each case in `runDraftSaveContract`. */
export type MakeDraftSaveContractHarness = () =>
  | DraftSaveContractHarness
  | Promise<DraftSaveContractHarness>;
