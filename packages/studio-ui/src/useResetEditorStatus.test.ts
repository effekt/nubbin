import { editorStatusStore } from "@nubbin/studio";
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import { useResetEditorStatus } from "./useResetEditorStatus";

test("clears status left by a prior editor instance", () => {
  editorStatusStore.set({ issues: [{ message: "old" }], issuesOpen: true, published: true });
  renderHook(() => useResetEditorStatus());
  expect(editorStatusStore.get()).toEqual({ issues: [], issuesOpen: false, published: false });
});
