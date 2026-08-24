import { afterEach, expect, test } from "vitest";
import { editorStatusStore } from "./editorStatusStore";
import { patchEditorStatus } from "./patchEditorStatus";

const initial = { issues: [], issuesOpen: false, published: false } as const;

afterEach(() => {
  editorStatusStore.set(initial);
});

test("folds the patch over what the store already holds", () => {
  patchEditorStatus({ issues: [{ message: "too long" }] });
  patchEditorStatus({ published: true });
  expect(editorStatusStore.get()).toEqual({
    issues: [{ message: "too long" }],
    issuesOpen: false,
    published: true,
  });
});

test("a refusal can open the dropdown in the same write as its issues", () => {
  patchEditorStatus({ issues: [{ message: "too long" }], issuesOpen: true });
  expect(editorStatusStore.get().issuesOpen).toBe(true);
});
