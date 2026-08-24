import type { Artifact } from "@nubbin/core";
import { catalog } from "demo/src/nubbin/catalog";
import { registry } from "demo/src/nubbin/registry";
import { compileVersion } from "./compileVersion";
import { toBlockPreviewVersion } from "./toBlockPreviewVersion";

/** One palette preview, compiled: the named block's single-block document through the same
 * compile seam every draft goes through, so what the panel shows is what a dropped block
 * would publish as. `undefined` for a name the catalog does not hold — the page's 404 —
 * rather than a refusal, because an unknown name is an address, not an authoring fault. */
export function blockPreviewArtifact(block: string): Artifact | undefined {
  if (catalog[block] === undefined) {
    return undefined;
  }
  return compileVersion(toBlockPreviewVersion(block, catalog, registry), `/block-preview/${block}`);
}
