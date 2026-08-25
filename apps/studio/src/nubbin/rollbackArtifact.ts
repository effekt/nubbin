import { checkRollback } from "@nubbin/core";
import type { RollbackOutcome } from "@nubbin/studio";
import studioConfig from "@nubbin/studio-config";
import { consumerOrigin } from "./consumerOrigin";
import { movePointerThroughOrigin } from "./movePointerThroughOrigin";
import { studioStore } from "./studioStore";
import { toDriftIssues } from "./toDriftIssues";

/** Applies the demo host's store and registry policy to a rollback request. */
export async function rollbackArtifact(route: string, hash: string): Promise<RollbackOutcome> {
  const artifact = await studioStore().read(hash);
  if (artifact === null) return { status: "missing", hash };
  if (artifact.route !== route) {
    return {
      status: "route-mismatch",
      hash,
      artifactRoute: artifact.route,
      requestedRoute: route,
    };
  }
  const verdict = checkRollback(artifact, studioConfig.registry);
  if (!verdict.compatible) {
    return {
      status: "refused",
      issues: toDriftIssues(verdict.drifted, artifact.blockVersions, studioConfig.registry),
    };
  }
  await movePointerThroughOrigin(route, hash);
  return { status: "rolled-back", hash, url: new URL(route, consumerOrigin()).href };
}
