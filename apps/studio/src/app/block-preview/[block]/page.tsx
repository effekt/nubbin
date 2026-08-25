import { Renderer } from "@nubbin/react";
import studioConfig from "@nubbin/studio-config";
import { notFound } from "next/navigation";
import { blockPreviewArtifact } from "../../../nubbin/blockPreviewArtifact";

/** How long a rendered preview is served before Next re-renders it. The block's real
 * cache key is the code itself — defaults, schema, component — and a code change restarts
 * the server; five minutes only bounds how stale a data-hinted field may look. */
export const revalidate = 300;

/**
 * One block, rendered real: the document the palette panel's iframe loads on hover. The
 * same render path as `/preview` — compile through the configured catalog and registry, then
 * `Renderer` with the consumer's block components and hole resolver — given the
 * single-block document `blockPreviewArtifact` builds instead of a draft. A page rather
 * than a route handler because a page renders under the root layout, whose stylesheet is
 * the consumer's own — the one home of the classes these blocks were written against — where
 * a handler would have to locate a hashed CSS asset by hand. Being a full document is
 * also what lets the iframe isolate consumer styles from the studio chrome. A name the
 * catalog does not hold is a 404.
 */
export default async function Page({ params }: { params: Promise<{ block: string }> }) {
  const { block } = await params;
  const artifact = blockPreviewArtifact(block);
  if (artifact === undefined) {
    notFound();
  }
  return (
    <Renderer
      artifact={artifact}
      registry={studioConfig.blockRegistry}
      resolveHole={studioConfig.resolveHole}
    />
  );
}
