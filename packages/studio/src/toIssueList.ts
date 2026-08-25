/**
 * Whatever carried the issues, as the issues: a `NubbinError` or an `{ok: false, issues}`
 * reply yields its `issues` array, a bare array is already the list, and anything else is
 * one issue-shaped unknown for the translation to judge.
 */
export function toIssueList(input: unknown): readonly unknown[] {
  if (Array.isArray(input)) {
    return input;
  }
  if (
    typeof input === "object" &&
    input !== null &&
    "issues" in input &&
    Array.isArray(input.issues)
  ) {
    return input.issues;
  }
  return [input];
}
