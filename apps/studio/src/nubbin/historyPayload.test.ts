import type { ArtifactStore, PointerMove, RoutePointer } from "@nubbin/core";
import { expect, test } from "vitest";
import { historyPayload } from "./historyPayload";

function move(n: number): PointerMove {
  return { hash: `hash${n}`, documentVersion: n, movedAt: `2026-08-${String(n).padStart(2, "0")}` };
}

// In-memory implementation of the adapter interface — the shape a store without history is
// allowed to take, per the ArtifactStore contract, and no mock of it.
function inMemoryStore(pointer: RoutePointer | null, log?: PointerMove[]): ArtifactStore {
  return {
    read: () => Promise.resolve(null),
    write: () => Promise.resolve(),
    manifest: () => Promise.resolve({ routes: [], generatedAt: "2026-08-24" }),
    pointer: () => Promise.resolve(pointer),
    publish: () => Promise.resolve(),
    unpublish: () => Promise.resolve(),
    ...(log === undefined ? {} : { history: () => Promise.resolve(log) }),
  };
}

const live: RoutePointer = {
  route: "/",
  matchKind: "exact",
  hash: "hash2",
  updatedAt: "2026-08-02",
};

test("a store with history answers the pointer's hash and the moves, newest first", async () => {
  const reply = await historyPayload(inMemoryStore(live, [move(1), move(2)]), "/");
  expect(reply.current).toBe("hash2");
  expect(reply.moves?.map((entry) => entry.hash)).toEqual(["hash2", "hash1"]);
  expect(reply.total).toBe(2);
});

test("a store without history answers null moves, never a crash on the absent method", async () => {
  await expect(historyPayload(inMemoryStore(live), "/")).resolves.toEqual({
    current: "hash2",
    moves: null,
    total: 0,
  });
});

test("an unpublished route reads as no current hash and no moves", async () => {
  await expect(historyPayload(inMemoryStore(null, []), "/")).resolves.toEqual({
    current: null,
    moves: [],
    total: 0,
  });
});
