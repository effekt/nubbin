import type { PuckApi } from "@measured/puck";

/**
 * Selects one node in Puck's editor by its Nubbin id; the adapter keeps Puck ids and node
 * ids one and the same, so the id an issue names is the id Puck can find. Selection goes
 * through the supported route: `getSelectorForId` for the item's place, `setUi` to make it
 * the selected item, which opens its fields and highlights it on the canvas. Answers whether
 * the node was found; a node an issue names but the data no longer holds is a no-op.
 */
export function selectPuckNode(
  puck: Pick<PuckApi, "getSelectorForId" | "dispatch">,
  nodeId: string,
): boolean {
  const selector = puck.getSelectorForId(nodeId);
  if (selector === undefined) {
    return false;
  }
  puck.dispatch({ type: "setUi", ui: { itemSelector: selector } });
  return true;
}
