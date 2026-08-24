import { detachIds } from "./detachIds";
import type { DocumentVersion, Node } from "./document.types";
import { idsReachableFrom } from "./idsReachableFrom";
import { requireNode } from "./requireNode";

// It cascades because removing a section means removing what was in it. Left behind, the children
// would be unreachable — which `compile` already refuses — so the alternative is a document that
// cannot compile until an author deletes each orphan by hand.
//
// Whether the slot it emptied is now below its `min` is `compile`'s judgment, as it is for every
// other operation here.
/**
 * Removes a node and everything beneath it, and drops the reference to it from whatever held it
 * — a slot, or the document's roots.
 *
 * The cascade follows slot references from the named node, so a descendant that a second slot
 * elsewhere also references goes with it.
 *
 * @param version - The document to edit. Read, never written.
 * @param nodeId - Id of the node to remove. The document must hold it.
 * @returns A new `DocumentVersion` with the subtree gone from `elements` and its id gone from
 *   every slot and from `roots`. The argument is not mutated, `version.version` is not bumped,
 *   and every surviving node the edit did not touch is carried over by reference.
 * @throws {NubbinError} `no-such-node` when `nodeId` names a node the document does not hold.
 * @example
 * ```ts
 * // stack → [a, b]; a → [a1, a2]
 * const next = removeNode(version, "a");
 * next.elements.a1; // undefined — the cascade reached it
 * next.elements.stack?.slots?.sections; // ["b"]
 *
 * // Removing the last root leaves an empty document, which `compile` refuses as `no-roots`.
 * removeNode(version, "stack").roots; // []
 * ```
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
