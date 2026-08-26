"use client";

import { editorStatusStore } from "@nubbin/studio";
import { useEffect } from "react";

/** Clears process-shared editor chrome state when a fresh editor mounts. */
export function useResetEditorStatus(): void {
  useEffect(() => {
    editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
  }, []);
}
