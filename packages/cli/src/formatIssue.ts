import type { NubbinIssue } from "@nubbin/core";

/**
 * One issue as one line: the code first, because it is what a program branches on and what the
 * reference page is indexed by, then the coordinates, then the prose.
 */
export function formatIssue(issue: NubbinIssue): string {
  const where = [issue.at, issue.path].filter((part) => part !== undefined).join(" ");
  return where === ""
    ? `${issue.code}: ${issue.message}`
    : `${issue.code} at ${where}: ${issue.message}`;
}
