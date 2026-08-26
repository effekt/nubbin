import type { DocumentVersion } from "@nubbin/core";
import { type AuthorIssue, editorStatusStore } from "@nubbin/studio";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import type { StudioDraftSaver } from "./studioEditorProps.types";
import { useDraftSave } from "./useDraftSave";

function draft(): DocumentVersion {
  return {
    documentId: "draft",
    version: 1,
    roots: ["hero"],
    elements: { hero: { id: "hero", block: "Hero", props: { title: "Before" } } },
    meta: { title: "Draft" },
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "test",
  };
}

function renderSave(saveDraft: StudioDraftSaver) {
  const initial = draft();
  const onReconciled = vi.fn();
  return {
    ...renderHook(() => useDraftSave("/", initial, "revision-1", saveDraft, onReconciled)),
    initial,
    onReconciled,
  };
}

afterEach(() => {
  vi.useRealTimers();
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("a save that lands advances the revision and stamps its issues", async () => {
  vi.useFakeTimers();
  const saveDraft = vi.fn<StudioDraftSaver>(() =>
    Promise.resolve({ status: "saved", revision: "revision-2", issues: [] }),
  );
  const { result, initial } = renderSave(saveDraft);
  result.current.save(initial);
  await vi.advanceTimersByTimeAsync(600);
  vi.useRealTimers();
  await waitFor(() => expect(editorStatusStore.get().savedAt).toBeDefined());
  expect(saveDraft).toHaveBeenCalledWith({
    route: "/",
    version: initial,
    expectedRevision: "revision-1",
  });
});

test("a saved refusal remains an issue rather than lost work", async () => {
  vi.useFakeTimers();
  const issues: readonly AuthorIssue[] = [{ message: "headline is too long" }];
  const { result, initial } = renderSave(() =>
    Promise.resolve({ status: "saved", revision: "revision-2", issues }),
  );
  result.current.save(initial);
  await vi.advanceTimersByTimeAsync(600);
  vi.useRealTimers();
  await waitFor(() => expect(editorStatusStore.get().issues).toEqual(issues));
  expect(editorStatusStore.get().savedAt).toBeDefined();
});

test("a failed round trip remains unsaved", async () => {
  vi.useFakeTimers();
  const { result, initial } = renderSave(() => Promise.reject(new Error("offline")));
  result.current.save(initial);
  await vi.advanceTimersByTimeAsync(600);
  vi.useRealTimers();
  await waitFor(() => expect(editorStatusStore.get().saveFailed).toBe(true));
  expect(editorStatusStore.get().savedAt).toBeUndefined();
});

test("a stale save exposes both values and retries the resolved document", async () => {
  vi.useFakeTimers();
  const remote = draft();
  const remoteHero = remote.elements.hero;
  if (remoteHero === undefined) throw new Error("fixture lost its hero");
  remoteHero.props.title = "Remote";
  const saveDraft = vi
    .fn<StudioDraftSaver>()
    .mockResolvedValueOnce({ status: "conflict", revision: "revision-2", version: remote })
    .mockResolvedValueOnce({ status: "saved", revision: "revision-3", issues: [] });
  const { result, initial, onReconciled } = renderSave(saveDraft);
  const local = structuredClone(initial);
  const localHero = local.elements.hero;
  if (localHero === undefined) throw new Error("fixture lost its hero");
  localHero.props.title = "Local";
  result.current.save(local);
  await act(() => vi.advanceTimersByTimeAsync(600));
  expect(result.current.conflicts).toHaveLength(1);

  act(() => result.current.resolve(0, "remote"));
  vi.useRealTimers();
  await waitFor(() => expect(saveDraft).toHaveBeenCalledTimes(2));
  expect(onReconciled).toHaveBeenLastCalledWith(
    expect.objectContaining({
      elements: expect.objectContaining({
        hero: expect.objectContaining({ props: expect.objectContaining({ title: "Remote" }) }),
      }),
    }),
  );
  expect(saveDraft.mock.calls[1]?.[0].expectedRevision).toBe("revision-2");
});
