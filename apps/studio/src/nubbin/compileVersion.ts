import type { Artifact, DocumentVersion } from "@nubbin/core";
import { compile } from "@nubbin/core";
import studioConfig from "@nubbin/studio-config";

/** One compile seam for stored drafts and candidate edits against this deployment's config. */
export function compileVersion(version: DocumentVersion, route: string): Artifact {
  return compile(version, studioConfig.catalog, studioConfig.registry, route).artifact;
}
