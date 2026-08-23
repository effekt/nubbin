import type { DocumentVersion, Node } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";
import { requireNode } from "./requireNode";
import { withElements } from "./withElements";
import { withSlotChild } from "./withSlotChild";

/**
 * Places a node in a parent's slot: a new `DocumentVersion` with the node registered and the
 * slot's order rewritten, copy-on-write, every other node untouched by reference.
 *
 * `node.id` arrives already minted. `core` runs in a browser, a worker and a build step, and a
 * generator inside it would make the same composition produce a different document every time —
 * so the caller mints, and the two things this can still check are the parent it names and the
 * id it brings.
 *
 * Slot legality is not one of them. Whether the block belongs in that slot, and whether the slot
 * is now over its `max`, is `compile`'s judgment — the same division `setNodeProp` follows for a
 * prop's validity, and what lets a document be illegal between two edits that end legal.
 *
 * `index` inserts; its absence appends.
 */
export function addNode(
  version: DocumentVersion,
  parentId: string,
  slot: string,
  node: Node,
  index?: number,
): DocumentVersion {
  const parent = requireNode(version, parentId);
  if (version.elements[node.id] !== undefined) {
    refuse(
      NubbinIssueCode.DuplicateNodeId,
      `document "${version.documentId}" already holds a node "${node.id}"`,
      node.id,
    );
  }
  return withElements(version, withSlotChild(parent, slot, node.id, index), node);
}
