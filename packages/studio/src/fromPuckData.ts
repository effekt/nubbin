import type { DocumentVersion, Node } from "@nubbin/core";
import { assertNoPuckZones } from "./assertNoPuckZones";
import { fromPuckComponent } from "./fromPuckComponent";
import type { PuckData } from "./puckData.types";
import { toDocumentMeta } from "./toDocumentMeta";

/** A Nubbin draft rebuilt from Puck's `Data`: `content` becomes `roots` in order, every nested
 * component is flattened back into `elements`, and slot-typed props become `Node.slots` id
 * arrays. Identity fields carry over from `prior` — this is the same edit `setNodeProp` or
 * `addNode` would have made, so it bumps nothing. `mintId` names ids for nodes Puck created;
 * the default mints the way `addNode`'s callers do, since `core` deliberately ships no
 * generator of its own. `blockSlots` — each block's declared slot names, from
 * `toSlotNamesByBlock` — makes slot detection schema-driven; without it the structural
 * reading stands. A `Data` whose legacy `zones` holds content is refused outright. */
export function fromPuckData(
  data: PuckData,
  prior: DocumentVersion,
  mintId: () => string = () => crypto.randomUUID(),
  blockSlots?: Record<string, readonly string[]>,
): DocumentVersion {
  assertNoPuckZones(data);
  const elements: Record<string, Node> = {};
  const ctx = { prior, elements, mintId, blockSlots };
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
