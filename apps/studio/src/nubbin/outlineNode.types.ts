/** One block as the outline lists it: the node's id and type, and its declared areas —
 * named slots holding other blocks — in declaration order. */
export interface OutlineNode {
  id: string;
  type: string;
  areas: readonly OutlineArea[];
}

/** One named area under a block: the slot's name, the blocks inside it, and the most it
 * may hold where the block's schema bounds it. */
export interface OutlineArea {
  name: string;
  // `| undefined` so an unbounded slot assigns directly under `exactOptionalPropertyTypes`.
  max?: number | undefined;
  children: readonly OutlineNode[];
}
