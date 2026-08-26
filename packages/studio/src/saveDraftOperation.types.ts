import type { DraftSave, DraftSaveOutcome } from "./draftSave.types";

/** Host-owned draft persistence and validation behind Studio's HTTP boundary. */
export type SaveDraftOperation = (save: DraftSave) => DraftSaveOutcome | Promise<DraftSaveOutcome>;
