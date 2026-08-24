import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { appendJsonLine } from "./appendJsonLine";
import { fsHistory } from "./fsHistory";
import { historyPath } from "./historyPath";

const freshRoot = () => mkdtemp(join(tmpdir(), "nubbin-history-"));

describe("fsHistory", () => {
  test("a route that never published reads as no moves, not a throw", async () => {
    expect(await fsHistory(await freshRoot(), "/x")).toEqual([]);
  });

  test("reads the appended moves back in file order — oldest first", async () => {
    const root = await freshRoot();
    const first = { hash: "a1", documentVersion: 1, movedAt: "2026-01-01T00:00:00Z" };
    const second = { hash: "a2", documentVersion: 2, movedAt: "2026-01-02T00:00:00Z" };
    await appendJsonLine(historyPath(root, "/x"), first);
    await appendJsonLine(historyPath(root, "/x"), second);
    expect(await fsHistory(root, "/x")).toEqual([first, second]);
  });

  test("routes keep separate logs — one route's moves never leak into another's", async () => {
    const root = await freshRoot();
    const move = { hash: "a1", documentVersion: 1, movedAt: "2026-01-01T00:00:00Z" };
    await appendJsonLine(historyPath(root, "/x"), move);
    expect(await fsHistory(root, "/y")).toEqual([]);
  });
});
