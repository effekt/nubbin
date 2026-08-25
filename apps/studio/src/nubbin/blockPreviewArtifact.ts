import type { Artifact } from "@nubbin/core";
import studioConfig from "@nubbin/studio-config";
import { compileVersion } from "./compileVersion";
import { toBlockPreviewVersion } from "./toBlockPreviewVersion";

/** One palette preview, compiled: the named block's single-block document through the same
 * compile seam every draft goes through, so what the panel shows is what a dropped block
 * would publish as. `undefined` for a name the catalog does not hold — the page's 404 —
 * rather than a refusal, because an unknown name is an address, not an authoring fault. */
export function blockPreviewArtifact(block: string): Artifact | undefined {
  if (studioConfig.catalog[block] === undefined) {
    return undefined;
  }
  return compileVersion(
    toBlockPreviewVersion(block, studioConfig.catalog, studioConfig.registry),
    `/block-preview/${block}`,
  );
}
