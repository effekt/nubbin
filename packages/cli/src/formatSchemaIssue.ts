import type { StandardSchemaV1 } from "@standard-schema/spec";

/** Beneath a heading line naming the file, so each issue reads as one of its causes. */
const INDENT = "  ";

/**
 * One Standard Schema issue as one indented line: the field it names, then its message, or the
 * message alone for an issue with no path — a value that was not an object at all. A path is
 * joined by dots whether its segments are bare keys or `{ key }` objects, since the spec allows
 * both and a plan's are always one deep.
 */
export function formatSchemaIssue(issue: StandardSchemaV1.Issue): string {
  const path = (issue.path ?? [])
    .map((segment) => String(typeof segment === "object" ? segment.key : segment))
    .join(".");
  return path === "" ? `${INDENT}${issue.message}` : `${INDENT}${path}: ${issue.message}`;
}
