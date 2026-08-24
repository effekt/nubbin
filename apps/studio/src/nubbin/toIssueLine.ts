/** One compile issue off the wire as a line an author reads: the field first when the issue
 * names one, then the compiler's own message. The shape is judged rather than trusted —
 * the reply crossed a network boundary, so anything else stringifies instead of throwing. */
export function toIssueLine(issue: unknown): string {
  if (typeof issue !== "object" || issue === null) {
    return String(issue);
  }
  const message =
    "message" in issue && typeof issue.message === "string" ? issue.message : JSON.stringify(issue);
  const path = "path" in issue && typeof issue.path === "string" ? issue.path : undefined;
  return path === undefined ? message : `${path}: ${message}`;
}
