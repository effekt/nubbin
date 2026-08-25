"use client";

import type { PublishTimings } from "@nubbin/studio";
import { formatSeconds } from "../nubbin/formatSeconds";

interface PublishStepsProps {
  timings: PublishTimings | undefined;
}

/** The publish as its three steps. The API is one round trip, so the steps stand pending —
 * an honest ellipsis, no invented progress — until the reply lands with the durations the
 * server measured, and then every step shows its check and its time at once. The check is a
 * glyph plus the duration in words, never a colour alone, and nothing here animates. */
export function PublishSteps({ timings }: PublishStepsProps) {
  const steps: [string, number | undefined][] = [
    ["Checked the page", timings?.compileMs],
    ["Built the new version", timings?.writeMs],
    ["Switched the live page over", timings?.moveMs],
  ];
  return (
    <ol className="nubbin-publish-steps">
      {steps.map(([label, ms]) => (
        <li key={label}>
          <span aria-hidden="true">{ms === undefined ? "…" : "✓"}</span>
          {label}
          {ms === undefined ? null : (
            <span className="nubbin-publish-step-time">{formatSeconds(ms)}</span>
          )}
        </li>
      ))}
    </ol>
  );
}
