"use client";

import { useCallback } from "react";
import { useDocumentListener } from "./useDocumentListener";

/** Escape closes whatever is open, from anywhere in the document — the listener exists
 * only while something is open, so a closed switcher costs nothing and swallows no keys. */
export function useCloseOnEscape(active: boolean, close: () => void): void {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    },
    [close],
  );
  useDocumentListener(active, "keydown", onKeyDown);
}
