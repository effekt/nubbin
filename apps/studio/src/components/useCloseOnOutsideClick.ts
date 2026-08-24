"use client";

import { type RefObject, useEffect } from "react";

/** A press outside the referenced element closes whatever is open — the listener exists
 * only while something is open, so a closed control costs nothing and swallows no clicks.
 * The click landed elsewhere on purpose, so closing steals no focus; that is the caller's
 * distinction to draw from Escape, which does hand focus back. */
export function useCloseOnOutsideClick(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
  close: () => void,
): void {
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const onMouseDown = (event: MouseEvent) => {
      const inside = event.target instanceof Node && ref.current?.contains(event.target) === true;
      if (!inside) {
        close();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [active, ref, close]);
}
