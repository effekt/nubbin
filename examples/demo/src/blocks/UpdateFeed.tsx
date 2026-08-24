import type { InferProps } from "@nubbin/core";
import { TimedEntryRow } from "./TimedEntryRow";
import type { updateFeedSchema } from "./UpdateFeed.schema";

type UpdateFeedProps = InferProps<typeof updateFeedSchema>;

/**
 * A timestamped record of what has changed, rendered in the order given — the data arrives
 * newest first, and sorting here would mean parsing `at`, which is display text rather than a
 * date. `entries` is meant to become per-request data; an empty list renders a quiet line
 * rather than a bare heading.
 */
export function UpdateFeed({ heading, entries }: UpdateFeedProps) {
  return (
    <section data-nubbin-block="UpdateFeed" className="bg-canvas px-6 py-24 text-marine">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-balance text-3xl font-semibold tracking-tight">{heading}</h2>
        {entries.length === 0 ? (
          <p className="mt-6 text-marine/70">Nothing has changed since the last edition.</p>
        ) : (
          <ul className="mt-6 space-y-4 border-t border-brass/30 pt-6 text-marine/80">
            {entries.map((entry) => (
              <TimedEntryRow
                key={`${entry.at} ${entry.text}`}
                entry={entry}
                timeClassName="text-teal"
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
