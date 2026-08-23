import type { Artifact } from "./artifact.types";
import { assertValidRoute } from "./assertValidRoute";
import type { Catalog } from "./catalog.types";
import type { CompileResult } from "./compileResult.types";
import { denormalize } from "./denormalize";
import type { DocumentVersion } from "./document.types";
import { hashArtifact } from "./hashArtifact";
import { NubbinError } from "./NubbinError";
import type { Registry } from "./registry.types";
import { resolveAllProps } from "./resolveAllProps";
import { usedBlockVersions } from "./usedBlockVersions";
import { validateStructure } from "./validateStructure";
import { NUBBIN_VERSION } from "./version.constants";

/**
 * Orchestration only. Structure first, and stop there if it failed — prop validation on a
 * document with dangling references produces cascading noise that buries the real cause.
 *
 * The route is judged before any of it, because it is baked into the artifact and into the
 * content address: an unaddressable route would otherwise compile, hash, and store cleanly, and
 * only fail to match a request once it was live.
 */
export function compile(
  version: DocumentVersion,
  catalog: Catalog,
  registry: Registry,
  route: string,
): CompileResult {
  assertValidRoute(route);
  const structural = validateStructure(version, registry);
  if (structural.length > 0) throw new NubbinError(structural);

  const { resolved, issues, reported } = resolveAllProps(version, catalog);
  if (issues.length > 0) throw new NubbinError(issues);

  // Every element resolved or an issue was thrown above; the fallback is unreachable.
  const tree = denormalize(version, (node) => resolved.get(node.id) ?? { props: {}, holes: {} });

  const content: Omit<Artifact, "hash"> = {
    route,
    documentId: version.documentId,
    documentVersion: version.version,
    blockVersions: usedBlockVersions(version, registry),
    tree,
    meta: version.meta,
    compiledWith: NUBBIN_VERSION,
  };
  return { artifact: { ...content, hash: hashArtifact(content) }, issues: reported };
}
