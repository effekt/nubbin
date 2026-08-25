import { parseHttpJson } from "./parseHttpJson";
import type { PublishOutcome } from "./publishOutcome.types";

/** Converts a non-ok publish or rollback response into author-visible issues. */
export function parsePublishRefusalHttpReply(status: number, body: string): PublishOutcome {
  const parsed = parseHttpJson(body);
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    "issues" in parsed &&
    Array.isArray(parsed.issues)
  ) {
    return { ok: false, issues: parsed.issues };
  }
  return { ok: false, issues: [{ message: body === "" ? `publish rejected (${status})` : body }] };
}
