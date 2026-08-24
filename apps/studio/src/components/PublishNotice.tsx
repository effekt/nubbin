"use client";

import { demoPageUrl } from "../nubbin/demoPageUrl";

interface PublishNoticeProps {
  route: string;
  hash: string | undefined;
}

/** The confirmation a publish earns: the route, the hash the store now points at, and the
 * one link that proves it — the demo's own page, which serves the artifact this publish
 * just wrote. */
export function PublishNotice({ route, hash }: PublishNoticeProps) {
  return (
    <p role="status" className="bg-canvas px-4 py-2 text-marine text-sm">
      Published <strong>{route}</strong>
      {hash === undefined ? null : (
        <>
          {" "}
          as <code>{hash}</code>
        </>
      )}{" "}
      —{" "}
      <a className="text-teal underline underline-offset-4" href={demoPageUrl(route)}>
        view it on the demo site
      </a>
    </p>
  );
}
