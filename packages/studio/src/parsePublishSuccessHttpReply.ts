import type { PublishOutcome } from "./publishOutcome.types";

/** Converts an ok publish or rollback body into its landed outcome. */
export function parsePublishSuccessHttpReply(route: string, body: string): PublishOutcome {
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
      const landed = { ok: true, route, hash: parsed.hash, url: parsed.url } as const;
      if ("timings" in parsed && typeof parsed.timings === "object" && parsed.timings !== null) {
        const { compileMs, writeMs, moveMs } = parsed.timings as Record<string, unknown>;
        if (
          typeof compileMs === "number" &&
          typeof writeMs === "number" &&
          typeof moveMs === "number"
        ) {
          return { ...landed, timings: { compileMs, writeMs, moveMs } };
        }
      }
      return landed;
    }
  } catch {
    // The recognized-shape refusal below also covers malformed JSON.
  }
  return {
    ok: false,
    issues: [{ message: "the publish endpoint answered with an unrecognised reply" }],
  };
}
