"use client";

import { useEffect } from "react";

const AUTO_DISMISS_MS = 6000;

export interface PublishNoticeProps {
  route: string;
  hash: string;
  url: string;
  onDismiss: () => void;
}

/** The confirmation a rollback earns — the only outcome that still reaches this strip, since
 * a publish reports inside the header's own panel: the route, the hash the pointer moved
 * back to, and the one link that proves it — the live page, at the URL the endpoint built
 * from the consumer-origin seam it alone holds. It leaves on its own after a moment, and
 * sooner on the close button — a confirmation that has been read is in the way. */
export function PublishNotice({ route, hash, url, onDismiss }: PublishNoticeProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <p role="status" className="nb-publish-notice">
      <span className="nb-publish-notice-message">
        Rolled back <strong>{route}</strong> to <code>{hash}</code> —{" "}
        <a className="nb-publish-notice-link" href={url}>
          view the live page
        </a>
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="nb-publish-notice-dismiss"
      >
        ×
      </button>
    </p>
  );
}
