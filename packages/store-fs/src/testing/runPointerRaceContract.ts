import type { ArtifactStore } from "@nubbin/core";
import { expect, test } from "vitest";
import { artifactFixture } from "./artifactFixture";

/** Enough writers that a shared temp path fails reliably rather than on an unlucky interleave. */
const WRITERS = ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"];

/**
 * The half of pointer atomicity a file-per-route does not give away: two publishes racing for one
 * route. Separate publishes to separate routes touch separate keys and cannot contend at all,
 * so a suite that only checks those reports a property it never exercised.
 *
 * Declared as loose `test` calls rather than its own `describe`, so these read as part of the
 * contract they belong to rather than a suite beside it.
 */
export function runPointerRaceContract(makeStore: () => Promise<ArtifactStore>): void {
  test("publishes racing for one route leave a whole winner, never a torn pointer", async () => {
    const store = await makeStore();
    await store.write(artifactFixture("a1", "/x"));
    await store.write(artifactFixture("a2", "/x"));
    await Promise.all([store.publish("/x", "a1"), store.publish("/x", "a2")]);
    const pointer = await store.pointer("/x");
    expect(pointer).not.toBeNull();
    expect(["a1", "a2"]).toContain(pointer?.hash);
  });

  test("many concurrent publishes to one route all settle, leaving one pointer", async () => {
    const store = await makeStore();
    for (const hash of WRITERS) {
      await store.write(artifactFixture(hash, "/x"));
    }
    await Promise.all(WRITERS.map((hash) => store.publish("/x", hash)));
    expect(WRITERS).toContain((await store.pointer("/x"))?.hash);
    expect((await store.manifest()).routes).toHaveLength(1);
  });
}
