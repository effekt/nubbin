import type { Artifact, ArtifactStore, PointerMove, RoutePointer } from "@nubbin/core";
import { NubbinIssueCode, parseMatchKind, refuse } from "@nubbin/core";

/** The reference implementation the contract suite defines equivalence against. Test-only. */
export function createMemoryArtifactStore(): ArtifactStore {
  const artifacts = new Map<string, Artifact>();
  const pointers = new Map<string, RoutePointer>();
  const moves = new Map<string, PointerMove[]>();
  return {
    read: async (hash) => artifacts.get(hash) ?? null,
    write: async (artifact) => {
      if (!artifacts.has(artifact.hash)) {
        artifacts.set(artifact.hash, artifact);
      }
    },
    pointer: async (route) => pointers.get(route) ?? null,
    publish: async (route, hash) => {
      const artifact = artifacts.get(hash);
      if (artifact === undefined) {
        refuse(
          NubbinIssueCode.ArtifactNotStored,
          `cannot publish ${route}: artifact ${hash} is not in the store`,
          route,
        );
      }
      const updatedAt = new Date().toISOString();
      pointers.set(route, { route, matchKind: parseMatchKind(route), hash, updatedAt });
      // Appended after the pointer moves, mirroring the fs store's ordering guarantee.
      const trail = moves.get(route) ?? [];
      trail.push({ hash, documentVersion: artifact.documentVersion, movedAt: updatedAt });
      moves.set(route, trail);
    },
    unpublish: async (route) => {
      pointers.delete(route);
    },
    manifest: async () => ({
      routes: [...pointers.values()],
      generatedAt: new Date().toISOString(),
    }),
    // Copied on the way out, so a caller mutating the answer cannot edit the record.
    history: async (route) => [...(moves.get(route) ?? [])],
  };
}
