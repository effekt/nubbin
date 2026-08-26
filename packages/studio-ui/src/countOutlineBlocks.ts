import type { OutlineNode } from "./outlineNode.types";

/** How many blocks Studio's outline holds, areas excluded and depth included — the number the
 * outline's header quotes beside its title. */
export function countOutlineBlocks(nodes: readonly OutlineNode[]): number {
  return nodes.reduce(
    (count, node) =>
      count + 1 + node.areas.reduce((inner, area) => inner + countOutlineBlocks(area.children), 0),
    0,
  );
}
