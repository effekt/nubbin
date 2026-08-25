import type { Node } from "@nubbin/core";
import type { PuckComponentData } from "./puckData.types";

/** One node as Puck holds it: `block` becomes `type`, props carry over, and each slot becomes
 * a prop of the same name holding the children inline, resolved recursively in slot order.
 * `id` is written last so the node's own id wins over any stray `id` prop. */
export function toPuckComponent(id: string, elements: Record<string, Node>): PuckComponentData {
  const node = elements[id];
  if (node === undefined) {
    throw new Error(`no element behind the id "${id}" — the draft holds a dangling child`);
  }
  const slotProps: Record<string, PuckComponentData[]> = {};
  for (const [slot, children] of Object.entries(node.slots ?? {})) {
    slotProps[slot] = children.map((child) => toPuckComponent(child, elements));
  }
  return { type: node.block, props: { ...node.props, ...slotProps, id: node.id } };
}
