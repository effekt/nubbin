"use client";

interface PublishNoticeProps {
  route: string;
  hash: string;
  url: string;
}

/** The confirmation a publish earns: the route, the hash the store now points at, and the
 * one link that proves it — the live page, at the URL the publish response built from the
 * consumer-origin seam it alone holds. */
export function PublishNotice({ route, hash, url }: PublishNoticeProps) {
  return (
    <p role="status" className="bg-canvas px-4 py-2 text-marine text-sm">
      Published <strong>{route}</strong> as <code>{hash}</code> —{" "}
      <a className="text-teal underline underline-offset-4" href={url}>
        view the live page
      </a>
    </p>
  );
}
