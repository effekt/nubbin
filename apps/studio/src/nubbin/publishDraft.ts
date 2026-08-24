import type { ArtifactStore } from "@nubbin/core";
import { compileDraft } from "./compileDraft";
import { movePointerThroughOrigin } from "./movePointerThroughOrigin";

/**
 * Write, then move the pointer — a pointer at an unwritten hash is a live 404. The move goes
 * through the consumer's origin rather than the store: `revalidatePath` reaches only the
 * cache of the process that runs it, so a pointer moved from here leaves the site serving
 * its cached page ([#545](https://github.com/effekt/nubbin/issues/545)). Returns the hash
 * the route now serves, or `undefined` when no draft exists.
 */
export async function publishDraft(
  store: ArtifactStore,
  route: string,
  movePointer: (route: string, hash: string) => Promise<void> = movePointerThroughOrigin,
): Promise<string | undefined> {
  const artifact = compileDraft(route);
  if (artifact === undefined) {
    return undefined;
  }
  await store.write(artifact);
  await movePointer(route, artifact.hash);
  return artifact.hash;
}
