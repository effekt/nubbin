import type { AuthorIssue } from "./authorIssue.types";

/**
 * One author issue as the line the panel shows: `Hero — Headline: maximum 80 characters`.
 * A missing block or label just shortens the line — the message always survives, because
 * it is the half the author cannot reconstruct.
 */
export function authorIssueLine(issue: AuthorIssue): string {
  const subject = [issue.blockName, issue.fieldLabel]
    .filter((part) => part !== undefined)
    .join(" — ");
  return subject === "" ? issue.message : `${subject}: ${issue.message}`;
}
