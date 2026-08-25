import type { Catalog, DocumentVersion } from "@nubbin/core";
import type { AuthorIssue } from "./authorIssue.types";
import { isNubbinIssueShape } from "./isNubbinIssueShape";
import { toAuthorIssue } from "./toAuthorIssue";
import { toIssueList } from "./toIssueList";

/**
 * A compile refusal in the words its author reads: whatever carried the issues — a
 * `NubbinError`, an `{ok: false, issues}` reply, a bare array — each issue looked up
 * against the draft for its block and against the catalog for its field label. A value
 * that is not issue-shaped still surfaces as a message rather than vanishing, because a
 * refusal the author cannot see is a refusal they cannot fix.
 */
export function toAuthorIssues(
  input: unknown,
  catalog: Catalog,
  version: DocumentVersion,
): readonly AuthorIssue[] {
  return toIssueList(input).map((issue) => {
    if (isNubbinIssueShape(issue)) {
      return toAuthorIssue(issue, catalog, version);
    }
    const message =
      typeof issue === "object" && issue !== null ? JSON.stringify(issue) : String(issue);
    return { message };
  });
}
