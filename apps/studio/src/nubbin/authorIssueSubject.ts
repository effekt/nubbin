import type { AuthorIssue } from "./authorIssue.types";

/**
 * The half of an issue that names where it lives — `Hero — Headline` — for the row that sets
 * the message beside it. A missing block or label just shortens the subject; both missing
 * yields nothing, and the row leans on the message alone.
 */
export function authorIssueSubject(issue: AuthorIssue): string | undefined {
  const subject = [issue.blockName, issue.fieldLabel]
    .filter((part) => part !== undefined)
    .join(" — ");
  return subject === "" ? undefined : subject;
}
