/**
 * One ISO datetime, formatted for the bar: "22 September at 05:41". Locale and zone are pinned
 * so a server render and a test agree wherever they run — the deadline names a moment on the
 * shoreline, not a moment in the reader's timezone.
 */
export function formatDeadline(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(new Date(iso));
}
