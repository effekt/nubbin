import type { ArtifactStore, LiveRoute, Manifest } from "@nubbin/core";

/** Reads the manifest and resolves every pointer without dropping unreadable artifacts. */
export async function loadLiveRoutes(
  store: ArtifactStore,
): Promise<{ manifest: Manifest; live: LiveRoute[] }> {
  const manifest = await store.manifest();
  const live = await Promise.all(
    manifest.routes.map(async (pointer) => ({
      pointer,
      artifact: await store.read(pointer.hash),
    })),
  );
  return { manifest, live };
}
