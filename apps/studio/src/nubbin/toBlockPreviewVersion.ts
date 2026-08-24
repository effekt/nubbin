import type { Catalog, DocumentVersion, Node, Registry } from "@nubbin/core";
import { previewNode } from "./previewNode";

/** How many slot levels the fill descends. Three covers the demo's deepest required chain
 * with room to spare; a catalog needing more is a catalog whose preview would not fit a
 * panel anyway. */
const PREVIEW_FILL_DEPTH = 3;

/** The single-block document behind one palette preview: the named block as the only root,
 * its defaults as props, and every required slot inhabited by `previewNode`. A block
 * rendered with its defaults is its preview — this builds the document that renders it. */
export function toBlockPreviewVersion(
  block: string,
  catalog: Catalog,
  registry: Registry,
): DocumentVersion {
  const elements: Record<string, Node> = {};
  const root = previewNode(block, catalog, registry, elements, PREVIEW_FILL_DEPTH);
  return {
    documentId: `block-preview-${block}`,
    version: 1,
    roots: [root],
    elements,
    meta: { title: block },
    createdAt: new Date().toISOString(),
    createdBy: "studio",
  };
}
