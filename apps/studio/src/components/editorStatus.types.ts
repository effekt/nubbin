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
  /** Whether the preview iframe has handed Puck its document — absent until it has, so
   * the status bar stays silent about a preview it has never seen render. */
  readonly frameLoaded?: boolean | undefined;
  /** How the last draft-save round trip ended: `true` when the endpoint could not be
   * reached at all — absent until a round trip has settled either way. */
  readonly saveFailed?: boolean | undefined;
}
