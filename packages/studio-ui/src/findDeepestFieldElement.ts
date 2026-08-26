import { fieldElementFor } from "./fieldElementFor";
import type { FoundField } from "./foundField.types";

/** The deepest rendered control a list of path prefixes reaches, walking longest first:
 * the leaf's own input when it is in the DOM, otherwise the nearest container that is —
 * a collapsed repeater row keeps its leaves out of the document, and the repeater's own
 * fieldset is then the honest landing. */
export function findDeepestFieldElement(
  region: ParentNode,
  nodeId: string,
  prefixes: readonly string[],
): FoundField | undefined {
  for (const path of prefixes) {
    const element = fieldElementFor(region, nodeId, path);
    if (element !== undefined) {
      return { element, path };
    }
  }
  return undefined;
}
