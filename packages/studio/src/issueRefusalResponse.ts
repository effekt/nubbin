import type { AuthorIssue } from "./authorIssue.types";

/** Serializes author-facing issues in Studio's common refusal envelope. */
export function issueRefusalResponse(issues: readonly AuthorIssue[], status?: number): Response {
  return Response.json({ ok: false, issues }, status === undefined ? undefined : { status });
}
