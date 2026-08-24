import type { InferProps } from "@nubbin/core";
import type { liveBandSchema } from "./LiveBand.schema";
import { TimedEntryRow } from "./TimedEntryRow";

type LiveBandProps = InferProps<typeof liveBandSchema>;

/**
 * A strip of what is happening right now. `items` is meant to be resolved per request rather
 * than frozen at publish, so the component takes whatever arrives — including nothing, which
 * renders as a quiet line rather than an empty ribbon.
 */
export function LiveBand({ label, items }: LiveBandProps) {
  return (
    <section
      data-nubbin-block="LiveBand"
      className="border-y-2 border-teal-light bg-marine px-6 py-4 text-canvas"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-baseline gap-x-8 gap-y-2 text-sm">
        <h2 className="flex items-baseline gap-x-2 text-xs font-semibold uppercase tracking-widest text-teal-light">
          <span
            aria-hidden="true"
            className="h-2 w-2 self-center rounded-full bg-orange motion-safe:animate-pulse"
          />
          {label}
        </h2>
        {items.length === 0 ? (
          <p className="text-canvas/60">Quiet on the water this hour.</p>
        ) : (
          <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
            {items.map((item) => (
              <TimedEntryRow
                key={`${item.at} ${item.text}`}
                entry={item}
                timeClassName="text-teal-light"
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
