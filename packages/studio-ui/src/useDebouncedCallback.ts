"use client";

import { useEffect, useMemo, useRef } from "react";

/** Returns a stable trailing-edge callback and clears its pending timer on unmount. */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
): (...args: Args) => void {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    callbackRef.current = callback;
  });
  useEffect(() => () => clearTimeout(timerRef.current), []);
  return useMemo(
    () =>
      (...args: Args) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
      },
    [delayMs],
  );
}
