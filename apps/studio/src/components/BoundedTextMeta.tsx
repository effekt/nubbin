"use client";

import "./issuesFlow.css";
import { overLimitLine } from "@nubbin/studio";

interface BoundedTextMetaProps {
  max: number;
  length: number;
}

/** The row under a bounded text input: the live `len/max` counter, and — past the bound —
 * the design's own line beside it. Shared by every control a schema bounds, so the counter
 * reads the same whether the string is plain or a link. */
export function BoundedTextMeta({ max, length }: BoundedTextMetaProps) {
  return (
    <div className="nubbin-bounded-meta">
      {length > max ? <p className="nubbin-bounded-message">{overLimitLine(max, length)}</p> : null}
      <span className="nubbin-bounded-counter">
        {length}/{max}
      </span>
    </div>
  );
}
