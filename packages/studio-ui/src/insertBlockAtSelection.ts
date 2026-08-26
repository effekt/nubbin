import type { PuckApi } from "@measured/puck";
import { isBlockAllowedInZone } from "./isBlockAllowedInZone";

/**
 * The palette's Enter key: insert a block where the author is looking. With a block
 * selected, the new one lands directly after it in the same zone; with nothing selected it
 * lands at the end of the page. The insert is refused — and reported false — where a drag
 * would be refused, so the keyboard cannot build a document the mouse could not.
 */
export function insertBlockAtSelection(
  puck: Pick<
    PuckApi,
    "appState" | "config" | "selectedItem" | "getSelectorForId" | "getItemById" | "dispatch"
  >,
  blockName: string,
): boolean {
  const selected =
    puck.selectedItem === null ? undefined : puck.getSelectorForId(puck.selectedItem.props.id);
  const zone = selected?.zone ?? "root:default-zone";
  if (!isBlockAllowedInZone(puck.config, puck.getItemById, zone, blockName)) {
    return false;
  }
  puck.dispatch({
    type: "insert",
    componentType: blockName,
    destinationIndex:
      selected === undefined ? puck.appState.data.content.length : selected.index + 1,
    destinationZone: zone,
  });
  return true;
}
