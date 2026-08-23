import type { DocumentVersion, Node } from "./document.types";

/**
 * A document with these nodes written into its elements, copy-on-write — the step every
 * operation ends with, whether it rewrote one node or added a second beside it.
 */
export function withElements(version: DocumentVersion, ...nodes: readonly Node[]): DocumentVersion {
  const elements = { ...version.elements };
  for (const node of nodes) {
    elements[node.id] = node;
  }
  return { ...version, elements };
}
