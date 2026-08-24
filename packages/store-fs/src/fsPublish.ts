import type { Artifact, RoutePointer } from "@nubbin/core";
import { NubbinIssueCode, parseMatchKind, refuse } from "@nubbin/core";
import { appendJsonLine } from "./appendJsonLine";
import { artifactPath } from "./artifactPath";
import { historyPath } from "./historyPath";
import { pointerPath } from "./pointerPath";
import { readJsonOrNull } from "./readJsonOrNull";
import { writeJsonAtomic } from "./writeJsonAtomic";

/**
 * Existence check first, so a typo'd hash cannot go live as a 404. `matchKind` comes from
 * core — an adapter deriving it itself is a second parser free to disagree.
 *
 * The pointer moves first and the move is logged after: a failure between the two leaves the
 * log short, which under-reports; the reverse order would let it claim a publish that never
 * went live. The document version comes from the artifact the existence check already read.
 */
export async function fsPublish(root: string, route: string, hash: string): Promise<void> {
  const artifact = await readJsonOrNull<Artifact>(artifactPath(root, hash));
  if (artifact === null) {
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
  await appendJsonLine(historyPath(root, route), {
    hash,
    documentVersion: artifact.documentVersion,
    movedAt: pointer.updatedAt,
  });
}
