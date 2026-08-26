import { fieldIdMatchesPath } from "./fieldIdMatchesPath";

/** The rendered control for one compiler path on one node, inside a region: the first
 * element whose `id` or `name` the addressing scheme resolves to the path. A leaf input
 * carries the id itself; a segmented enum names each radio by it; a repeater or fieldset
 * carries the id of the prop it edits. */
export function fieldElementFor(
  region: ParentNode,
  nodeId: string,
  path: string,
): HTMLElement | undefined {
  for (const element of region.querySelectorAll<HTMLElement>("[id], [name]")) {
    const named = element.getAttribute("name");
    if (
      fieldIdMatchesPath(element.id, nodeId, path) ||
      (named !== null && fieldIdMatchesPath(named, nodeId, path))
    ) {
      return element;
    }
  }
  return undefined;
}
