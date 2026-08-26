"use client";

import { type RefObject, useCallback } from "react";
import { useDocumentListener } from "./useDocumentListener";

/** A press outside the referenced element closes whatever is open — the listener exists
 * only while something is open, so a closed control costs nothing and swallows no clicks.
 * The click landed elsewhere on purpose, so closing steals no focus; that is the caller's
 * distinction to draw from Escape, which does hand focus back. */
export function useCloseOnOutsideClick(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
  close: () => void,
): void {
  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      const inside = event.target instanceof Node && ref.current?.contains(event.target) === true;
      if (!inside) close();
    },
    [ref, close],
  );
  useDocumentListener(active, "mousedown", onMouseDown);
}
