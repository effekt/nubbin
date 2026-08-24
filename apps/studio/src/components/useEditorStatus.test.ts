import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { editorStatusStore } from "./editorStatusStore";
import { useEditorStatus } from "./useEditorStatus";

afterEach(() => {
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("reads the store's snapshot and re-renders when it moves", () => {
  const { result } = renderHook(() => useEditorStatus());
  expect(result.current.issues).toEqual([]);
  act(() => {
    editorStatusStore.set({
      issues: [{ message: "too long" }],
      issuesOpen: true,
      published: false,
    });
  });
  expect(result.current.issues).toEqual([{ message: "too long" }]);
  expect(result.current.issuesOpen).toBe(true);
});
