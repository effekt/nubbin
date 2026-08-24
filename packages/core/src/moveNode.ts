import { detachIds } from "./detachIds";
import type { DocumentVersion } from "./document.types";
import { requireNode } from "./requireNode";
import { withElements } from "./withElements";
import { withSlotChild } from "./withSlotChild";

// `index` names a position in the target slot *as it stands after the node is taken out*, which
// is the only reading under which "move it to the end" is the slot's length.
//
// It does not refuse a move into the node's own subtree. That makes a cycle and detaches the node
// from the roots, and `compile` refuses both by name — judging it here would be a second opinion
// on one question, which is the division every operation in this package follows.
/**
 * Moves a node into a slot: the reference is taken out of whatever held it — a slot, or the
 * document's roots — and placed in the target slot.
 *
 * A move rewrites references, never the node. Reordering within one slot is a move to the same
 * parent and slot with a new `index`.
 *
 * @param version - The document to edit. Read, never written.
 * @param nodeId - Id of the node to move. The document must hold it.
 * @param toParentId - Id of the node whose slot receives it. The document must hold it, and it
 *   may be the parent the node already sits under.
 * @param toSlot - Slot name on that parent. A slot the parent has never filled is opened.
 * @param index - Position in the target slot as it stands *after* the node is taken out, so the
 *   last position is that slot's length. Omit to append.
 * @returns A new `DocumentVersion` with the reference moved. The argument is not mutated, the
 *   moved node is carried over by reference along with every node the edit did not touch, and
 *   `version.version` is not bumped.
 * @throws {NubbinError} `no-such-node` when `nodeId` or `toParentId` names a node the document
 *   does not hold.
 * @example
 * ```ts
 * // sections: [a, b, c] → aside: [a]
 * const next = moveNode(version, "a", "stack", "aside");
 *
 * // Reorder inside one slot: [a, b, c] → [b, c, a]
 * const last = moveNode(version, "a", "stack", "sections", 2);
 *
 * // A root becomes a child, and drops out of `roots`.
 * const nested = moveNode(version, "loose", "stack", "sections");
 * ```
 */
export function moveNode(
  version: DocumentVersion,
  nodeId: string,
  toParentId: string,
  toSlot: string,
  index?: number,
): DocumentVersion {
  requireNode(version, nodeId);
  requireNode(version, toParentId);
  const detached = detachIds(version, new Set([nodeId]));
  const parent = requireNode(detached, toParentId);
  return withElements(detached, withSlotChild(parent, toSlot, nodeId, index));
}
