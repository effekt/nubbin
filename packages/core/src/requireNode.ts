import type { DocumentVersion, Node } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";

/**
 * The node an operation was asked to act on, or a refusal naming it and the document.
 *
 * Every document operation opens with this question, and answering it in one place is what keeps
 * the four of them saying the same thing when the answer is no.
 */
export function requireNode(version: DocumentVersion, nodeId: string): Node {
  const node = version.elements[nodeId];
  if (node === undefined) {
    refuse(
      NubbinIssueCode.NoSuchNode,
      `no node "${nodeId}" in document "${version.documentId}"`,
      nodeId,
    );
  }
  return node;
}
