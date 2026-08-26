"use client";

import { type EditorStatus, editorStatusStore } from "@nubbin/studio";
import { useSyncExternalStore } from "react";

/** Subscribes one piece of editor chrome to the shared Studio status store. */
export function useEditorStatus(): EditorStatus {
  return useSyncExternalStore(
    editorStatusStore.subscribe,
    editorStatusStore.get,
    editorStatusStore.get,
  );
}
