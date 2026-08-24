"use client";

import { useEffect } from "react";

const AUTO_DISMISS_MS = 6000;

interface PublishNoticeProps {
  route: string;
  hash: string;
  url: string;
  onDismiss: () => void;
}

/** The confirmation a publish earns: the route, the hash the store now points at, and the
 * one link that proves it — the live page, at the URL the publish response built from the
 * consumer-origin seam it alone holds. It leaves on its own after a moment, and sooner on
 * the close button — a confirmation that has been read is in the way. */
export function PublishNotice({ route, hash, url, onDismiss }: PublishNoticeProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <p role="status" className="flex items-baseline gap-2 bg-canvas px-4 py-2 text-marine text-sm">
      <span className="min-w-0">
        Published <strong>{route}</strong> as <code>{hash}</code> —{" "}
        <a className="text-teal underline underline-offset-4" href={url}>
          view the live page
        </a>
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-auto rounded px-1 font-semibold text-marine/70 hover:text-marine focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        ×
      </button>
    </p>
  );
}
