import type { DocumentVersion } from "@nubbin/core";
import type { AuthorIssue } from "./authorIssue.types";
import type { PuckData } from "./puckData.types";
import type { StudioEditorConfig } from "./studioConfig.types";
import type { StudioOperations } from "./studioOperations.types";

/** Persists one folded draft through the host application's boundary. The Studio owns
 * debouncing and status; the host owns transport, authorization, and durable storage. */
export type StudioDraftSaver = (
  route: string,
  version: DocumentVersion,
) => Promise<readonly AuthorIssue[] | undefined>;

/** Everything a host supplies to one reusable Studio editor instance. This contract is
 * independent of the host framework, its routes, and its persistence implementation. */
export interface StudioEditorProps {
  readonly config: StudioEditorConfig;
  readonly route: string;
  readonly routes: readonly string[];
  readonly initialData: PuckData;
  readonly initialVersion: DocumentVersion;
  /** The consumer app's origin, read server-side and used to resolve root-relative links. */
  readonly consumerOrigin: string;
  readonly saveDraft: StudioDraftSaver;
  readonly operations: StudioOperations;
}
