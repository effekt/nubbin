import { useEffect, useMemo, useRef } from "react";

/** The trailing-edge debounce the autosave leans on: each call re-arms the timer, and only
 * the last arguments within the window fire. The callback is read through a ref so the
 * debounced identity is stable across renders, and the pending timer is cleared on unmount
 * so nothing fires into an unmounted editor. */
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
