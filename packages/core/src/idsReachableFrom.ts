import type { Node } from "./document.types";
import { slotEdges } from "./slotEdges";

/**
 * Every id a slot walk reaches from the given seeds, not counting the seeds themselves — whether
 * or not an element backs each one, because a slot may reference an id nothing holds.
 *
 * Carries a visited set rather than assuming the graph is a tree. `validateStructure` refuses a
 * cycle, but it runs at compile, and a document is free to be illegal between two edits that end
 * legal — so a walk here can meet one and must return from it. A seed reached as another's child
 * is therefore in the result, which is what makes it right for both callers.
 */
export function idsReachableFrom(
  elements: Record<string, Node>,
  seeds: readonly string[],
): Set<string> {
  const found = new Set<string>();
  const pending = [...seeds];
  while (pending.length > 0) {
    const id = pending.pop();
    const node = id === undefined ? undefined : elements[id];
    if (node === undefined) {
      continue;
    }
    for (const edge of slotEdges(node)) {
      if (found.has(edge.childId)) {
        continue;
      }
      found.add(edge.childId);
      pending.push(edge.childId);
    }
  }
  return found;
}
