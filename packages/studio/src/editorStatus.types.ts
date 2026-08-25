import type { AuthorIssue } from "./authorIssue.types";

/** The shared editor state written by the canvas and read by Studio chrome. */
export interface EditorStatus {
  readonly issues: readonly AuthorIssue[];
  readonly issuesOpen: boolean;
  readonly published: boolean;
  readonly savedAt?: string | undefined;
  readonly frameLoaded?: boolean | undefined;
  readonly saveFailed?: boolean | undefined;
}
