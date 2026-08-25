"use client";

import type { PublishOutcome, PublishSuccess } from "../nubbin/publishOutcome.types";
import type { StudioOperations } from "../nubbin/studioOperations.types";
import { HistoryPanel } from "./HistoryPanel";
import { LiveStrip } from "./LiveStrip";
import { PublishSteps } from "./PublishSteps";

export type PublishView = "history" | "publishing" | "published";

interface PublishPanelProps {
  view: PublishView;
  route: string;
  operations: StudioOperations;
  landed: PublishSuccess | undefined;
  onOutcome: (outcome: PublishOutcome) => void;
  onShowHistory: () => void;
}

/** The split control's one popover, wearing whichever face the moment needs: the route's
 * history behind the chevron, the three-step report while a publish is in flight, and the
 * landed report — steps checked with the server's timings, the live strip, and the way into
 * history — once it returns. */
export function PublishPanel({
  view,
  route,
  operations,
  landed,
  onOutcome,
  onShowHistory,
}: PublishPanelProps) {
  if (view === "history") {
    return <HistoryPanel route={route} operations={operations} onOutcome={onOutcome} />;
  }
  return (
    <div className="nubbin-history" role="status">
      <h2>{view === "publishing" ? "Publishing" : "Published"}</h2>
      <PublishSteps timings={view === "published" ? landed?.timings : undefined} />
      {view === "published" && landed !== undefined ? (
        <LiveStrip url={landed.url} onShowHistory={onShowHistory} />
      ) : null}
    </div>
  );
}
