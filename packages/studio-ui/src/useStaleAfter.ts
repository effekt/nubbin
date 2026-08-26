"use client";

import { useEffect, useState } from "react";

/**
 * Whether `ms` milliseconds have passed since the ISO-8601 `stamp`: false while the stamp
 * is fresh or absent, flipping to true — with a re-render — once the moment arrives. Each
 * new stamp starts the clock over, which is what lets an autosave note say "just now" and
 * then stop claiming it.
 */
export function useStaleAfter(stamp: string | undefined, ms: number): boolean {
  const [stale, setStale] = useState(false);
  useEffect(() => {
    setStale(false);
    if (stamp === undefined) {
      return;
    }
    const remaining = ms - (Date.now() - Date.parse(stamp));
    if (remaining <= 0) {
      setStale(true);
      return;
    }
    const timer = setTimeout(() => setStale(true), remaining);
    return () => clearTimeout(timer);
  }, [stamp, ms]);
  return stale;
}
