import type { NubbinIssue } from "./nubbinIssue.types";

/**
 * The prose a `NubbinError` carries as its message. One issue reads as itself, so a single
 * refusal has no framing to strip; several read as a count and a line each, because `compile`
 * collects rather than stopping at the first and framing that showed only one would throw the
 * collection away at the boundary.
 */
export function summariseIssues(issues: readonly NubbinIssue[]): string {
  const lines = issues.map((issue) =>
    issue.at === undefined
      ? `${issue.message} [${issue.code}]`
      : `${issue.at} [${issue.code}]: ${issue.message}`,
  );
  const only = lines[0];
  if (lines.length === 1 && only !== undefined) {
    return only;
  }
  return `Refused with ${issues.length} issue(s):\n${lines.join("\n")}`;
}
