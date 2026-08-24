import type { Catalog, DocumentVersion } from "@nubbin/core";
import { dataHintAt } from "./dataHintAt";

/**
 * A field carrying a `data` hint is resolved per request: a value written there would be
 * stored, compiled into a hole, and replaced before it was ever served — a write that is never
 * wrong and never visible. Refusing by name is the only outcome that tells the truth. See
 * `docs/decisions/an-edited-document-goes-back-where-it-came-from.md`.
 *
 * A node the document does not hold is left for `setNodeProp` to refuse, which names it.
 */
export function refuseHintedPath(
  catalog: Catalog,
  version: DocumentVersion,
  nodeId: string,
  path: string,
): void {
  const block = version.elements[nodeId]?.block;
  if (block === undefined) return;
  const hinted = dataHintAt(catalog, block, path);
  if (hinted !== undefined) {
    throw new Error(
      `"${hinted}" on ${block} resolves per request, so a value set there would be ` +
        `compiled into a hole and replaced before anyone saw it`,
    );
  }
}
