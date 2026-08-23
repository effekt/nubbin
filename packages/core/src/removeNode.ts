import { detachIds } from "./detachIds";
import type { DocumentVersion, Node } from "./document.types";
import { idsReachableFrom } from "./idsReachableFrom";
import { requireNode } from "./requireNode";

/**
 * Removes a node and everything beneath it: a new `DocumentVersion` with the subtree gone, the
 * reference to it dropped from whatever held it, and every other node untouched by reference.
 *
 * It cascades because removing a section means removing what was in it. Left behind, the children
 * would be unreachable — which `compile` already refuses — so the alternative is a document that
 * cannot compile until an author deletes each orphan by hand.
 *
 * Whether the slot it emptied is now below its `min` is `compile`'s judgment, as it is for every
 * other operation here.
 */
export function removeNode(version: DocumentVersion, nodeId: string): DocumentVersion {
  requireNode(version, nodeId);
  const removed = idsReachableFrom(version.elements, [nodeId]).add(nodeId);
  const detached = detachIds(version, removed);
  const elements: Record<string, Node> = {};
  for (const [id, node] of Object.entries(detached.elements)) {
    if (!removed.has(id)) {
      elements[id] = node;
    }
  }
  return { ...detached, elements };
}
