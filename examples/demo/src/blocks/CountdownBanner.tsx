import type { InferProps } from "@nubbin/core";
import type { countdownBannerSchema } from "./CountdownBanner.schema";
import { formatDeadline } from "./formatDeadline";

type CountdownBannerProps = InferProps<typeof countdownBannerSchema>;

/**
 * The deadline renders as a formatted moment, not a ticking remainder: a hole resolver is
 * handed the field's route, node and spec but never the node's other props, so "time left
 * until this deadline" is not derivable per request — and a client timer would make the bar
 * a client component, which a block cannot be. The `<time>` element keeps the machine value.
 */
export function CountdownBanner({ text, deadline }: CountdownBannerProps) {
  return (
    <aside
      data-nubbin-block="CountdownBanner"
      aria-label="Countdown"
      className="border-y border-brass/30 bg-canvas px-6 py-3 text-center text-sm text-marine"
    >
      <p>
        <span className="font-semibold">{text}</span>{" "}
        <time dateTime={deadline} className="font-mono tabular-nums text-teal">
          {formatDeadline(deadline)}
        </time>
      </p>
    </aside>
  );
}
