"use client";

interface LiveStripProps {
  url: string;
  onShowHistory: () => void;
}

/** The word a landed publish earns, inside the panel: what visitors see now, that new edits
 * stay private until the next publish, and the one link that proves it. Beneath it, the way
 * into the route's history — rolling back is this panel's other half. */
export function LiveStrip({ url, onShowHistory }: LiveStripProps) {
  return (
    <div className="nubbin-live-strip">
      <p role="status">
        <strong>Live — published just now.</strong> Visitors see this version. New edits stay
        private until you publish again.{" "}
        <a href={url} target="_blank" rel="noreferrer">
          View live ↗
        </a>
      </p>
      <button type="button" onClick={onShowHistory}>
        Roll back to an earlier version…
      </button>
    </div>
  );
}
