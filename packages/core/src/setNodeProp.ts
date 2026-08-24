import type { DocumentVersion } from "./document.types";
import { requireNode } from "./requireNode";
import { setAtPath } from "./setAtPath";
import { withElements } from "./withElements";

// The first document operation. It lives beside `compile` so any caller — an editor, a script,
// an agent — writes a document the same way.
//
// It does not validate the value (that is `compile`'s job at the next compile) and does not bump
// `version` — appending a version is the authoring store's concern, not a property of one edit.
/**
 * Sets one prop on one node, addressed by a dotted path into that node's `props`.
 *
 * The value is not checked against the block's schema here. `compile` reports a bad one as an
 * `invalid-props` issue at the offending path, so a document may hold a value its schema
 * rejects between two edits that end valid.
 *
 * @param version - The document to edit. Read, never written.
 * @param nodeId - Id of the node whose props are rewritten. The document must hold it.
 * @param path - Dotted path into the node's props, in the syntax `setAtPath` defines:
 *   `headline`, `cta.label`. Missing intermediate objects are created; `items[]` is refused.
 * @param value - What to write at that path. Unvalidated, and replaces whatever sits there.
 * @returns A new `DocumentVersion` carrying a new `Node` for `nodeId` with the prop set. The
 *   argument is not mutated, `version.version`, `roots`, `meta` and `createdAt` are untouched,
 *   and every other node is carried over by reference.
 * @throws {NubbinError} `no-such-node` when `nodeId` names a node the document does not hold;
 *   `path-not-addressable` when the path names no single field — an `items[]` segment, an empty
 *   segment, or a descent into an array.
 * @example
 * ```ts
 * const next = setNodeProp(version, "hero", "headline", "After");
 * next.elements.hero?.props.headline; // "After"
 *
 * // A dotted path reaches inside an object prop, leaving its siblings in place.
 * setNodeProp(version, "hero", "cta.label", "Buy").elements.hero?.props.cta;
 * // { label: "Buy", href: "/" }
 * ```
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
