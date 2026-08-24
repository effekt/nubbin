import type { ArtifactStore } from "@nubbin/core";
import { compileDraft } from "./compileDraft";
import { movePointerThroughOrigin } from "./movePointerThroughOrigin";
import type { PublishTimings } from "./publishTimings.types";
import { timedMs } from "./timedMs";

/**
 * Write, then move the pointer — a pointer at an unwritten hash is a live 404. The move goes
 * through the consumer's origin rather than the store: `revalidatePath` reaches only the
 * cache of the process that runs it, so a pointer moved from here leaves the site serving
 * its cached page ([#545](https://github.com/effekt/nubbin/issues/545)). Each step is timed
 * around the work itself, so the reply's report shows durations the server actually saw.
 * Returns the hash the route now serves with those timings, or `undefined` when no draft
 * exists.
 */
export async function publishDraft(
  store: ArtifactStore,
  route: string,
  movePointer: (route: string, hash: string) => Promise<void> = movePointerThroughOrigin,
): Promise<{ hash: string; timings: PublishTimings } | undefined> {
  const compiled = await timedMs(() => compileDraft(route));
  const artifact = compiled.value;
  if (artifact === undefined) {
    return undefined;
  }
  const wrote = await timedMs(() => store.write(artifact));
  const moved = await timedMs(() => movePointer(route, artifact.hash));
  return {
    hash: artifact.hash,
    timings: { compileMs: compiled.ms, writeMs: wrote.ms, moveMs: moved.ms },
  };
}
