import type { DocumentVersion } from "./document.types";
import { idsReachableFrom } from "./idsReachableFrom";

/** Every id a slot walk from the roots can reach, whether or not an element backs it. */
export function reachableIds(version: DocumentVersion): Set<string> {
  const reached = idsReachableFrom(version.elements, version.roots);
  for (const root of version.roots) {
    reached.add(root);
  }
  return reached;
}
