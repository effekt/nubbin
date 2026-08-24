import type { DocumentVersion } from "./document.types";
import { requireNode } from "./requireNode";
import { setAtPath } from "./setAtPath";
import { withElements } from "./withElements";

/**
 * The first document operation: a new `DocumentVersion` with one prop set on one node,
 * copy-on-write, every other node untouched by reference. It lives beside `compile` so any
 * caller — an editor, a script, an agent — writes a document the same way.
 *
 * It does not validate the value (that is `compile`'s job at the next compile) and does not
 * bump `version` — appending a version is the authoring store's concern, not a property of one
 * edit.
 */
export function setNodeProp(
  version: DocumentVersion,
  nodeId: string,
  path: string,
  value: unknown,
): DocumentVersion {
  const node = requireNode(version, nodeId);
  return withElements(version, { ...node, props: setAtPath(node.props, path, value) });
}
