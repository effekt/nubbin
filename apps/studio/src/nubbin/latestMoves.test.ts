import type { PointerMove } from "@nubbin/core";
import { expect, test } from "vitest";
import { latestMoves } from "./latestMoves";

function move(n: number): PointerMove {
  return { hash: `hash${n}`, documentVersion: n, movedAt: `2026-08-${String(n).padStart(2, "0")}` };
}

test("moves come back newest first", () => {
  const { moves, total } = latestMoves([move(1), move(2), move(3)]);
  expect(moves.map((entry) => entry.hash)).toEqual(["hash3", "hash2", "hash1"]);
  expect(total).toBe(3);
});

test("a long log is capped at the last twenty, and total still counts them all", () => {
  const log = Array.from({ length: 25 }, (_, index) => move(index + 1));
  const { moves, total } = latestMoves(log);
  expect(moves).toHaveLength(20);
  expect(moves[0]?.hash).toBe("hash25");
  expect(moves.at(-1)?.hash).toBe("hash6");
  expect(total).toBe(25);
});

test("an empty log is an empty answer, not a throw", () => {
  expect(latestMoves([])).toEqual({ moves: [], total: 0 });
});
