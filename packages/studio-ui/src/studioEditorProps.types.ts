import type { DocumentVersion } from "@nubbin/core";
import type {
  AuthorIssue,
  DraftRevision,
  DraftSave,
  DraftSaveOutcome,
  PuckData,
  StudioOperations,
} from "@nubbin/studio";
import type { StudioEditorConfig } from "./studioConfig.types";

/** Persists one folded draft through the host application's boundary. */
export type StudioDraftSaver = (save: DraftSave) => Promise<DraftSaveOutcome<AuthorIssue>>;

/** Everything a host supplies to one reusable Studio editor instance. */
export interface StudioEditorProps {
  readonly config: StudioEditorConfig;
  readonly route: string;
  readonly routes: readonly string[];
  readonly initialData: PuckData;
  readonly initialVersion: DocumentVersion;
  readonly initialRevision: DraftRevision;
  readonly consumerOrigin: string;
  readonly saveDraft: StudioDraftSaver;
  readonly operations: StudioOperations;
}
