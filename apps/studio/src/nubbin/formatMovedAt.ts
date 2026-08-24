const DATE_AND_MINUTES = 16;

/**
 * A move's ISO-8601 timestamp as the panel shows it: date and minutes, the `T` swapped for a
 * space — `2026-08-24 14:03`. Plain string surgery on purpose: the stamp is already ISO, and
 * a locale-aware rendering would show two editors two spellings of one move.
 */
export function formatMovedAt(movedAt: string): string {
  return movedAt.slice(0, DATE_AND_MINUTES).replace("T", " ");
}
