import type { DocumentVersion } from "@nubbin/core";
import { expect, test, vi } from "vitest";
import { DraftSaveMachine } from "./DraftSaveMachine";

const version = (): DocumentVersion => ({
  documentId: "home",
  version: 1,
  roots: ["hero"],
  elements: { hero: { id: "hero", block: "Hero", props: { title: "Before" } } },
  meta: { title: "Home" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
});

test("serializes an edit made while the prior save is in flight", async () => {
  type Saved = { status: "saved"; revision: string; issues: readonly [] };
  let resolveFirst: ((value: Saved) => void) | undefined;
  const first = new Promise<Saved>((resolve) => {
    resolveFirst = resolve;
  });
  const save = vi
    .fn()
    .mockReturnValueOnce(first)
    .mockResolvedValueOnce({ status: "saved", revision: "r3", issues: [] });
  const callbacks = { reconciled: vi.fn(), conflicts: vi.fn(), saved: vi.fn(), failed: vi.fn() };
  const initial = version();
  const machine = new DraftSaveMachine("/", initial, "r1", save, callbacks);
  const firstEdit = { ...initial, meta: { title: "First" } };
  const secondEdit = { ...initial, meta: { title: "Second" } };
  machine.queue(firstEdit);
  const flushing = machine.flush();
  machine.queue(secondEdit);
  if (resolveFirst === undefined) throw new Error("save resolver was not captured");
  resolveFirst({ status: "saved", revision: "r2", issues: [] });
  await flushing;

  expect(save).toHaveBeenCalledTimes(2);
  expect(save.mock.calls[1]?.[0]).toEqual({
    route: "/",
    version: secondEdit,
    expectedRevision: "r2",
  });
  expect(callbacks.failed).not.toHaveBeenCalled();
});

test("automatically retries non-overlapping descendants against the remote revision", async () => {
  const initial = version();
  const local = structuredClone(initial);
  const remote = structuredClone(initial);
  const localHero = local.elements.hero;
  const remoteHero = remote.elements.hero;
  if (localHero === undefined || remoteHero === undefined) throw new Error("fixture lost its hero");
  localHero.props.title = "Local";
  remoteHero.props.body = "Remote";
  const save = vi
    .fn()
    .mockResolvedValueOnce({ status: "conflict", revision: "r2", version: remote })
    .mockResolvedValueOnce({ status: "saved", revision: "r3", issues: [] });
  const callbacks = { reconciled: vi.fn(), conflicts: vi.fn(), saved: vi.fn(), failed: vi.fn() };
  const machine = new DraftSaveMachine("/", initial, "r1", save, callbacks);
  machine.queue(local);
  await machine.flush();

  expect(save).toHaveBeenCalledTimes(2);
  expect(save.mock.calls[1]?.[0].expectedRevision).toBe("r2");
  expect(save.mock.calls[1]?.[0].version.elements.hero?.props).toEqual({
    title: "Local",
    body: "Remote",
  });
  expect(callbacks.conflicts).not.toHaveBeenCalled();
});
