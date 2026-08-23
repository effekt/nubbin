import type { Node } from "./document.types";

/**
 * A node with the named ids dropped from every slot that held one.
 *
 * Returns the node itself when it held none, so a caller rebuilding a document leaves every
 * untouched sibling untouched by reference — the copy-on-write property each document operation
 * carries.
 *
 * A slot left empty stays declared and empty. Whether that is legal against its `min` is
 * `compile`'s judgment, not this one's.
 */
export function withoutSlotChildren(node: Node, removed: ReadonlySet<string>): Node {
  const entries = Object.entries(node.slots ?? {});
  const holdsRemoved = entries.some(([, children]) => children.some((id) => removed.has(id)));
  if (!holdsRemoved) {
    return node;
  }
  const slots = Object.fromEntries(
    entries.map(([slot, children]) => [slot, children.filter((id) => !removed.has(id))]),
  );
  return { ...node, slots };
}
