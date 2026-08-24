import type { DocumentVersion, Node } from "@nubbin/core";
import { fromPuckComponent } from "./fromPuckComponent";
import type { PuckData } from "./puckData.types";
import { toDocumentMeta } from "./toDocumentMeta";

/** A Nubbin draft rebuilt from Puck's `Data`: `content` becomes `roots` in order, every nested
 * component is flattened back into `elements`, and slot-typed props become `Node.slots` id
 * arrays. Identity fields carry over from `prior` — this is the same edit `setNodeProp` or
 * `addNode` would have made, so it bumps nothing. `mintId` names ids for nodes Puck created;
 * the default mints the way `addNode`'s callers do, since `core` deliberately ships no
 * generator of its own. */
export function fromPuckData(
  data: PuckData,
  prior: DocumentVersion,
  mintId: () => string = () => crypto.randomUUID(),
): DocumentVersion {
  const elements: Record<string, Node> = {};
  const ctx = { prior, elements, mintId };
  return {
    documentId: prior.documentId,
    version: prior.version,
    roots: data.content.map((component) => fromPuckComponent(component, ctx)),
    elements,
    meta: toDocumentMeta(data.root.props, prior.meta),
    createdAt: prior.createdAt,
    createdBy: prior.createdBy,
  };
}
