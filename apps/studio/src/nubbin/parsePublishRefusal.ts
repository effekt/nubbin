import type { PublishOutcome } from "./publishOutcome.types";

/**
 * A non-ok publish reply as issues: the endpoint's `{ok: false, issues}` JSON when the
 * compiler refused, or the body text as one issue for any other refusal — an empty body
 * still yields a line naming the status, so no refusal is ever silent.
 */
export function parsePublishRefusal(status: number, body: string): PublishOutcome {
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
    // Not JSON — the body is the message itself.
  }
  return { ok: false, issues: [{ message: body === "" ? `publish rejected (${status})` : body }] };
}
