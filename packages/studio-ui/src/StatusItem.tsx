import type { StatusSegment } from "./statusSegment.types";

/** One status-strip segment: its dot — the state's colour, never the only signal, since
 * every kind says different words — and the words themselves. Plain segments carry no dot. */
export function StatusItem({ segment }: { segment: StatusSegment }) {
  return (
    <span className={`nb-statusbar-item nb-statusbar-${segment.kind}`}>
      {segment.kind === "plain" ? null : (
        <span className={`nb-statusbar-dot nb-statusbar-dot-${segment.kind}`} aria-hidden="true" />
      )}
      {segment.text}
    </span>
  );
}
