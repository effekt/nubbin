"use client";

import { type RefObject, useCallback } from "react";
import { useCloseOnEscape } from "./useCloseOnEscape";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";

/** Gives floating controls one consistent dismissal contract: outside clicks close in place,
 * while Escape closes and restores focus to the control that opened the popup. */
export function useDismissiblePopup(
  active: boolean,
  rootRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  dismiss: () => void,
): () => void {
  const dismissAndFocus = useCallback(() => {
    dismiss();
    triggerRef.current?.focus();
  }, [dismiss, triggerRef]);
  useCloseOnEscape(active, dismissAndFocus);
  useCloseOnOutsideClick(active, rootRef, dismiss);
  return dismissAndFocus;
}
