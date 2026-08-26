"use client";

import { BrokenBlock } from "@nubbin/studio-ui";
import { useParams } from "next/navigation";

/**
 * What the palette's preview iframe shows when a block throws on its own defaults — a
 * developer fault, since defaults are the consumer's to keep valid, but one that must not
 * crash the panel: the same marked placeholder the canvas degrades to, in place of Next's
 * bare error page. `useParams` names the block because Next hands an error boundary only
 * the error itself.
 */
export default function PreviewError() {
  const params = useParams<{ block: string }>();
  return <BrokenBlock name={params.block} hint="Its defaults break it — a fix lands in code." />;
}
