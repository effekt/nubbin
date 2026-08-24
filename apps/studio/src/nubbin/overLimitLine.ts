/**
 * The inline over-limit line beside a bounded field's counter, in the design's own words:
 * what to do first, then where the value stands — so the fix reads before the diagnosis.
 */
export function overLimitLine(max: number, length: number): string {
  return `Keep it under ${max} characters — it's ${length} now.`;
}
