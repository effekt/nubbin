import type { DocumentVersion, Node } from "./document.types";
import { withoutSlotChildren } from "./withoutSlotChildren";

/**
 * A document with these ids referenced by nothing: dropped from every slot that held one and
 * from the roots, with the elements themselves left in place.
 *
 * The step `removeNode` and `moveNode` share. One then deletes the elements it detached, the
 * other places the single id it detached somewhere else — and neither has to know how a
 * reference is held to stop holding it.
 */
export function detachIds(version: DocumentVersion, ids: ReadonlySet<string>): DocumentVersion {
  const elements: Record<string, Node> = {};
  for (const [id, node] of Object.entries(version.elements)) {
    elements[id] = withoutSlotChildren(node, ids);
  }
  return { ...version, roots: version.roots.filter((id) => !ids.has(id)), elements };
}
