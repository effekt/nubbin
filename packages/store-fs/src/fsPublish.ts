import type { RoutePointer } from "@nubbin/core";
import { NubbinIssueCode, parseMatchKind, refuse } from "@nubbin/core";
import { artifactPath } from "./artifactPath";
import { pointerPath } from "./pointerPath";
import { readJsonOrNull } from "./readJsonOrNull";
import { writeJsonAtomic } from "./writeJsonAtomic";

/**
 * Existence check first, so a typo'd hash cannot go live as a 404. `matchKind` comes from
 * core — an adapter deriving it itself is a second parser free to disagree.
 */
export async function fsPublish(root: string, route: string, hash: string): Promise<void> {
  if (!(await readJsonOrNull(artifactPath(root, hash)))) {
    refuse(
      NubbinIssueCode.ArtifactNotStored,
      `cannot publish ${route}: artifact ${hash} is not in the store`,
      route,
    );
  }
  const pointer: RoutePointer = {
    route,
    matchKind: parseMatchKind(route),
    hash,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonAtomic(pointerPath(root, route), pointer);
}
