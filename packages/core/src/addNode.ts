import type { DocumentVersion, Node } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";
import { requireNode } from "./requireNode";
import { withElements } from "./withElements";
import { withSlotChild } from "./withSlotChild";

// `node.id` arrives already minted. `core` runs in a browser, a worker and a build step, and a
// generator inside it would make the same composition produce a different document every time —
// so the caller mints, and the two things this can still check are the parent it names and the
// id it brings.
//
// Slot legality is not one of them. Whether the block belongs in that slot, and whether the slot
// is now over its `max`, is `compile`'s judgment — the same division `setNodeProp` follows for a
// prop's validity, and what lets a document be illegal between two edits that end legal.
/**
 * Places a node in a parent's slot and registers it among the document's elements.
 *
 * The caller mints `node.id`; `crypto.randomUUID()` in the calling code is the usual source.
 *
 * @param version - The document to edit. Read, never written.
 * @param parentId - Id of the node whose slot receives the child. The document must already
 *   hold it.
 * @param slot - Slot name on that parent. A slot the parent has never filled is opened.
 * @param node - The node to place. Its `id` must be one the document does not already hold.
 * @param index - Position in the slot's child list as it stands before the insert. Omit to
 *   append; an index past the end appends.
 * @returns A new `DocumentVersion` with the node registered and the slot's order rewritten.
 *   The argument is not mutated, `version.version` is not bumped, and every node the edit did
 *   not touch is carried over by reference.
 * @throws {NubbinError} `no-such-node` when `parentId` names a node the document does not
 *   hold; `duplicate-node-id` when `node.id` is already in use, which would replace the node
 *   holding it and redirect every slot that named it.
 * @example
 * ```ts
 * const next = addNode(version, "stack", "sections", {
 *   id: crypto.randomUUID(),
 *   block: "Card",
 *   props: { title: "New" },
 * });
 *
 * // Second in the slot rather than last.
 * const inserted = addNode(version, "stack", "sections", card, 1);
 * ```
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
