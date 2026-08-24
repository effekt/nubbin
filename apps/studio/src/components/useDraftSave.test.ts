import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { blankDraft } from "../nubbin/blankDraft";
import { editorStatusStore } from "./editorStatusStore";
import { useDraftSave } from "./useDraftSave";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("a save that lands stamps the status with issues and the save's own time", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", () => Promise.resolve(Response.json({ ok: true })));
  const { result } = renderHook(() => useDraftSave("/"));
  result.current(blankDraft("/"));
  vi.advanceTimersByTime(600);
  vi.useRealTimers();
  await waitFor(() => {
    expect(editorStatusStore.get().savedAt).toBeDefined();
  });
  expect(editorStatusStore.get().issues).toEqual([]);
});

test("a refused save carries the endpoint's words as an issue, and still stamps the time", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", () =>
    Promise.resolve(new Response("the store is read-only", { status: 500 })),
  );
  const { result } = renderHook(() => useDraftSave("/"));
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
