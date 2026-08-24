import type { ArtifactStore } from "@nubbin/core";
import { expect, test } from "vitest";
import { artifactFixture } from "./artifactFixture";

/**
 * What `history` promises where an adapter implements it. Each test builds its store and skips
 * when `history` is absent — an adapter without it is valid, so its suite must stay green
 * rather than fail or silently assert nothing.
 *
 * Loose `test` calls rather than a `describe`, like the race contract, so these read as part
 * of the contract they belong to.
 */
export function runHistoryContract(makeStore: () => Promise<ArtifactStore>): void {
  const storeWithHistory = async (ctx: { skip: () => void }) => {
    const store = await makeStore();
    if (store.history === undefined) ctx.skip();
    return store;
  };

  test("history records every publish in order, oldest first", async (ctx) => {
    const store = await storeWithHistory(ctx);
    await store.write(artifactFixture("a1", "/x"));
    await store.write(artifactFixture("a2", "/x"));
    await store.publish("/x", "a1");
    await store.publish("/x", "a2");
    const moves = (await store.history?.("/x")) ?? [];
    expect(moves.map((move) => move.hash)).toEqual(["a1", "a2"]);
    expect(moves.every((move) => move.documentVersion === 1)).toBe(true);
  });

  test("only published states appear — a written artifact is not a move", async (ctx) => {
    const store = await storeWithHistory(ctx);
    await store.write(artifactFixture("a1", "/x"));
    expect(await store.history?.("/x")).toEqual([]);
  });

  test("unpublish leaves the trail — a route taken down and put back keeps it", async (ctx) => {
    const store = await storeWithHistory(ctx);
    await store.write(artifactFixture("a1", "/x"));
    await store.publish("/x", "a1");
    await store.unpublish("/x");
    expect(((await store.history?.("/x")) ?? []).map((move) => move.hash)).toEqual(["a1"]);
  });

  test("republishing the same hash is a second move — dedupe is for artifacts", async (ctx) => {
    const store = await storeWithHistory(ctx);
    await store.write(artifactFixture("a1", "/x"));
    await store.publish("/x", "a1");
    await store.publish("/x", "a1");
    expect(((await store.history?.("/x")) ?? []).map((move) => move.hash)).toEqual(["a1", "a1"]);
  });
}
