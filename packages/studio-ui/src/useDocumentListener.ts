"use client";

import { useEffect } from "react";

export function useDocumentListener<K extends keyof DocumentEventMap>(
  active: boolean,
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
): void {
  useEffect(() => {
    if (!active) return undefined;
    document.addEventListener(type, listener);
    return () => document.removeEventListener(type, listener);
  }, [active, type, listener]);
}
