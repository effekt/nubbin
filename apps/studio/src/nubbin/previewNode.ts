import type { Catalog, Node, Registry } from "@nubbin/core";
import { firstAllowedBlock } from "./firstAllowedBlock";

/** Writes one node for `block` into `elements` — its catalog `defaults` as props — and
 * recursively inhabits every slot whose `min` demands children, so the single-block
 * document the preview compiles is not refused for an empty required slot. Each such slot
 * receives exactly `min` children of the first block it allows, rendered with their own
 * defaults: the preview should look inhabited anyway. Ids are minted from the insertion
 * count, so the same block always builds the same document and its artifact hash holds
 * still. `depth` bounds the recursion; at zero, slots stay empty and the compile refusal
 * is the caller's to see rather than a stack overflow's.
 *
 * @returns The id of the node written for `block` itself.
 */
export function previewNode(
  block: string,
  catalog: Catalog,
  registry: Registry,
  elements: Record<string, Node>,
  depth: number,
): string {
  const id = `preview-${Object.keys(elements).length + 1}`;
  const node: Node = { id, block, props: { ...catalog[block]?.defaults } };
  elements[id] = node;
  for (const [name, constraint] of Object.entries(registry.get(block)?.slots ?? {})) {
    const child = firstAllowedBlock(constraint, registry);
    if ((constraint.min ?? 0) < 1 || depth < 1 || child === undefined) {
      continue;
    }
    const children: string[] = [];
    for (let count = 0; count < (constraint.min ?? 0); count += 1) {
      children.push(previewNode(child, catalog, registry, elements, depth - 1));
    }
    node.slots = { ...node.slots, [name]: children };
  }
  return id;
}
