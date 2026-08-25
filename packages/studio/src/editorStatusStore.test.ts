import { afterEach, expect, test, vi } from "vitest";
import { createStatusStore } from "./createStatusStore";
import { editorStatusStore } from "./editorStatusStore";
import { patchEditorStatus } from "./patchEditorStatus";

const initial = { issues: [], issuesOpen: false, published: false } as const;

afterEach(() => editorStatusStore.set(initial));

test("a status store replaces its snapshot and notifies active subscribers", () => {
  const store = createStatusStore(0);
  const listener = vi.fn();
  const unsubscribe = store.subscribe(listener);
  store.set(2);
  unsubscribe();
  store.set(3);
  expect(store.get()).toBe(3);
  expect(listener).toHaveBeenCalledTimes(1);
});

test("the editor store begins closed and assumes the draft is unpublished", () => {
  expect(editorStatusStore.get()).toEqual(initial);
});

test("partial status writes preserve observations from other editor surfaces", () => {
  patchEditorStatus({ issues: [{ message: "too long" }], issuesOpen: true });
  patchEditorStatus({ published: true });
  expect(editorStatusStore.get()).toEqual({
    issues: [{ message: "too long" }],
    issuesOpen: true,
    published: true,
  });
});
