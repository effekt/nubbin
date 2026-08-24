import type { PublishOutcome } from "./publishOutcome.types";

/**
 * An ok publish reply as an outcome: the endpoint's `{ok: true, hash, url}` JSON, carried
 * through with the route the caller asked to publish. A 2xx body that is not the contract's
 * shape becomes a refusal saying so — a fabricated hash or link would claim a publish this
 * client cannot show.
 */
export function parsePublishSuccess(route: string, body: string): PublishOutcome {
  try {
    const parsed: unknown = JSON.parse(body);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "hash" in parsed &&
      typeof parsed.hash === "string" &&
      "url" in parsed &&
      typeof parsed.url === "string"
    ) {
      return { ok: true, route, hash: parsed.hash, url: parsed.url };
    }
  } catch {
    // Not JSON — fall through to the refusal below.
  }
  return {
    ok: false,
    issues: [{ message: "the publish endpoint answered with an unrecognised reply" }],
  };
}
