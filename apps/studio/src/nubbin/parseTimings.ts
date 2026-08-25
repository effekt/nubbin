import type { PublishTimings } from "@nubbin/studio";

/**
 * Judges a publish reply's `timings` member — three numbers or nothing. `undefined` for any
 * other shape rather than a refusal: the publish itself landed, and a report missing its
 * durations is still a report, so the member degrades alone.
 */
export function parseTimings(value: unknown): PublishTimings | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }
  const { compileMs, writeMs, moveMs } = value as Record<string, unknown>;
  if (typeof compileMs !== "number" || typeof writeMs !== "number" || typeof moveMs !== "number") {
    return undefined;
  }
  return { compileMs, writeMs, moveMs };
}
