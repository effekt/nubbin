import { type AuthorIssue, editorStatusStore } from "@nubbin/studio";
import { useDraftSave } from "@nubbin/studio-ui";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { blankDraft } from "../nubbin/blankDraft";

afterEach(() => {
  vi.useRealTimers();
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("a save that lands stamps the status with issues and the save's own time", async () => {
  vi.useFakeTimers();
  const saveDraft = vi.fn(() => Promise.resolve(undefined));
  const { result } = renderHook(() => useDraftSave("/", saveDraft));
  const draft = blankDraft("/");
  result.current(draft);
  vi.advanceTimersByTime(600);
  vi.useRealTimers();
  await waitFor(() => {
    expect(editorStatusStore.get().savedAt).toBeDefined();
  });
  expect(editorStatusStore.get().issues).toEqual([]);
  expect(saveDraft).toHaveBeenCalledWith("/", draft);
});

test("a refused save carries the endpoint's words as an issue, and still stamps the time", async () => {
  vi.useFakeTimers();
  const issues: readonly AuthorIssue[] = [{ message: "the store is read-only" }];
  const { result } = renderHook(() => useDraftSave("/", () => Promise.resolve(issues)));
  result.current(blankDraft("/"));
  vi.advanceTimersByTime(600);
  vi.useRealTimers();
  await waitFor(() => {
    expect(editorStatusStore.get().issues.map((issue) => issue.message)).toEqual([
      "the store is read-only",
    ]);
  });
  expect(editorStatusStore.get().savedAt).toBeDefined();
});

test("a save that never reaches the endpoint marks the round trip failed, not saved", async () => {
  vi.useFakeTimers();
  const { result } = renderHook(() =>
    useDraftSave("/", () => Promise.reject(new Error("connection refused"))),
  );
  result.current(blankDraft("/"));
  vi.advanceTimersByTime(600);
  vi.useRealTimers();
  await waitFor(() => {
    expect(editorStatusStore.get().saveFailed).toBe(true);
  });
  expect(editorStatusStore.get().savedAt).toBeUndefined();
});

test("a save that lands clears a failure the round trip before it left", async () => {
  vi.useFakeTimers();
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false, saveFailed: true });
  const { result } = renderHook(() => useDraftSave("/", () => Promise.resolve(undefined)));
  result.current(blankDraft("/"));
  vi.advanceTimersByTime(600);
  vi.useRealTimers();
  await waitFor(() => {
    expect(editorStatusStore.get().saveFailed).toBe(false);
  });
});
