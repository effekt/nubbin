import { detachIds } from "./detachIds";
import type { DocumentVersion } from "./document.types";
import { requireNode } from "./requireNode";
import { withElements } from "./withElements";
import { withSlotChild } from "./withSlotChild";

/**
 * Moves a node into a slot: a new `DocumentVersion` with the reference taken out of whatever held
 * it — a slot or the roots — and placed in the target, the node itself untouched by reference.
 *
 * `index` names a position in the target slot *as it stands after the node is taken out*, which
 * is the only reading under which "move it to the end" is the slot's length. Its absence appends.
 *
 * It does not refuse a move into the node's own subtree. That makes a cycle and detaches the node
 * from the roots, and `compile` refuses both by name — judging it here would be a second opinion
 * on one question, which is the division every operation in this package follows.
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
