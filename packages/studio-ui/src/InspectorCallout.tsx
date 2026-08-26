"use client";

import { blockCalloutLine } from "./blockCalloutLine";

interface InspectorCalloutProps {
  blockName: string;
  count: number;
}

/** The callout at the top of the fields panel when the selected block has issues: the
 * count, and the reassurance that edits persist while going live waits. A status, because
 * it appears and disappears as the author works. */
export function InspectorCallout({ blockName, count }: InspectorCalloutProps) {
  return (
    <p role="status" className="nubbin-inspector-callout">
      {blockCalloutLine(blockName, count)}
    </p>
  );
}
