"use client";

import { useSyncExternalStore } from "react";
import type { EditorStatus } from "./editorStatus.types";
import { editorStatusStore } from "./editorStatusStore";

/**
 * The header chrome's read on the editor's status, live: re-renders exactly the component
 * that called it when the store moves, which is what keeps the pill's count and the publish
 * label current under a referentially stable overrides object. The snapshot doubles as the
 * server snapshot — the store's initial value is what the server would have said.
 */
export function useEditorStatus(): EditorStatus {
  return useSyncExternalStore(
    editorStatusStore.subscribe,
    editorStatusStore.get,
    editorStatusStore.get,
  );
}
