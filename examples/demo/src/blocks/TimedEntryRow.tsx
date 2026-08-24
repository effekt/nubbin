import type { InferProps } from "@nubbin/core";
import type { timedEntrySchema } from "./timedEntry.schema";

type TimedEntry = InferProps<typeof timedEntrySchema>;

/**
 * One row of a timed list: the time, then the text. `at` is display text an author or a
 * resolver already formatted, so it renders verbatim — parsing or reformatting it here would
 * be a second concern. Both LiveBand and UpdateFeed compose this row, which is why it is a
 * unit rather than two inlined maps.
 */
export function TimedEntryRow({
  entry,
  timeClassName,
}: {
  entry: TimedEntry;
  timeClassName: string;
}) {
  return (
    <li className="flex items-baseline gap-x-3">
      <span className={`shrink-0 font-mono text-xs tabular-nums ${timeClassName}`}>{entry.at}</span>
      <span>{entry.text}</span>
    </li>
  );
}
