import type { Artifact, ArtifactStore, RoutePointer } from "@nubbin/core";
import { NubbinIssueCode, parseMatchKind, refuse } from "@nubbin/core";

/** The reference implementation the contract suite defines equivalence against. Test-only. */
export function createMemoryArtifactStore(): ArtifactStore {
  const artifacts = new Map<string, Artifact>();
  const pointers = new Map<string, RoutePointer>();
  return {
    read: async (hash) => artifacts.get(hash) ?? null,
    write: async (artifact) => {
      if (!artifacts.has(artifact.hash)) {
        artifacts.set(artifact.hash, artifact);
      }
    },
    pointer: async (route) => pointers.get(route) ?? null,
    publish: async (route, hash) => {
      if (!artifacts.has(hash)) {
        refuse(
          NubbinIssueCode.ArtifactNotStored,
          `cannot publish ${route}: artifact ${hash} is not in the store`,
          route,
        );
      }
      pointers.set(route, {
        route,
        matchKind: parseMatchKind(route),
        hash,
        updatedAt: new Date().toISOString(),
      });
    },
    unpublish: async (route) => {
      pointers.delete(route);
    },
    manifest: async () => ({
      routes: [...pointers.values()],
      generatedAt: new Date().toISOString(),
    }),
  };
}
