/** Where the time of day sits inside an ISO timestamp: `2026-08-24T14:02:31.000Z` → `14:02`. */
const TIME_STARTS = 11;
const MINUTES_END = 16;

/**
 * A feed entry shows a time, not a date — and the shaping belongs here rather than in a block,
 * because an artifact carries display text and a component that formats its own timestamp is
 * the canonical single-concern violation in this repository.
 */
export const timeOfDay = (epochMs: number): string =>
  new Date(epochMs).toISOString().slice(TIME_STARTS, MINUTES_END);
