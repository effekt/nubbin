import type { PublishOutcome } from "./publishOutcome.types";

/** Converts a non-ok publish or rollback response into author-visible issues. */
export function parsePublishRefusalHttpReply(status: number, body: string): PublishOutcome {
  try {
    const parsed: unknown = JSON.parse(body);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "issues" in parsed &&
      Array.isArray(parsed.issues)
    ) {
      return { ok: false, issues: parsed.issues };
    }
  } catch {
    // Plain text is the endpoint's readable refusal.
  }
  return { ok: false, issues: [{ message: body === "" ? `publish rejected (${status})` : body }] };
}
