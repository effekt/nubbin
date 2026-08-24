/** What a compiler issue looks like after a network hop: `message` for certain, `at` and
 * `path` where the compiler placed it. Codes travel too but the translation never branches
 * on them, so the shape does not demand one. */
export interface WireIssue {
  readonly message: string;
  readonly at?: string;
  readonly path?: string;
}

/** Judges a value off the wire as a compiler issue, member by member — the reply crossed a
 * network boundary, so the shape is checked rather than trusted. */
export function isNubbinIssueShape(value: unknown): value is WireIssue {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const issue = value as Record<string, unknown>;
  return (
    typeof issue.message === "string" &&
    (issue.at === undefined || typeof issue.at === "string") &&
    (issue.path === undefined || typeof issue.path === "string")
  );
}
