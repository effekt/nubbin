const MS_PER_SECOND = 1000;

/** A duration in milliseconds as the report's compact word for it — `0.3s`, one decimal,
 * so a 12ms step reads as `0.0s` rather than pretending to precision nobody checks. */
export function formatSeconds(ms: number): string {
  return `${(ms / MS_PER_SECOND).toFixed(1)}s`;
}
