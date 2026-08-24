"use client";

import { useEffect } from "react";

/** Escape closes whatever is open, from anywhere in the document — the listener exists
 * only while something is open, so a closed switcher costs nothing and swallows no keys. */
export function useCloseOnEscape(active: boolean, close: () => void): void {
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, close]);
}
