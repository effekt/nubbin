"use client";

import { useSyncExternalStore } from "react";
import type { EditorStatus } from "./editorStatus.types";
import { editorStatusStore } from "./editorStatusStore";

/** Subscribes one piece of editor chrome to the shared Studio status store. */
export function useEditorStatus(): EditorStatus {
  return useSyncExternalStore(
    editorStatusStore.subscribe,
    editorStatusStore.get,
    editorStatusStore.get,
  );
}
