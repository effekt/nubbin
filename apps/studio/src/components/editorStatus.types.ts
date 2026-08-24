import type { AuthorIssue } from "../nubbin/authorIssue.types";

/**
 * What the header chrome knows about the draft without being re-rendered by the editor:
 * the current issue set (save-time or publish-refusal, whichever spoke last), whether the
 * issues dropdown stands open, and whether the live pointer matches everything typed —
 * `published` starts false because a fresh page load cannot prove it does.
 */
export interface EditorStatus {
  readonly issues: readonly AuthorIssue[];
  readonly issuesOpen: boolean;
  readonly published: boolean;
  /** When the draft last reached the endpoint, ISO-8601 — absent until a save lands, and
   * cleared by each edit, so the status bar never claims a save it cannot prove. */
  readonly savedAt?: string | undefined;
}
