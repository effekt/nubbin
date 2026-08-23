import type { Node } from "./document.types";

/**
 * A node with one child id placed in a slot: `index` inserts, its absence appends, and a slot the
 * node has never filled is opened.
 *
 * The inverse of `withoutSlotChildren`, and the step `addNode` and `moveNode` share — placing a
 * reference is the same act whether the node is new or arriving from somewhere else in the
 * document.
 */
export function withSlotChild(node: Node, slot: string, childId: string, index?: number): Node {
  const children = [...(node.slots?.[slot] ?? [])];
  children.splice(index ?? children.length, 0, childId);
  return { ...node, slots: { ...node.slots, [slot]: children } };
}
