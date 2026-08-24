import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { useStaleAfter } from "./useStaleAfter";

afterEach(() => {
  vi.useRealTimers();
});

test("an absent stamp is never stale", () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useStaleAfter(undefined, 10_000));
  act(() => vi.advanceTimersByTime(60_000));
  expect(result.current).toBe(false);
});

test("a fresh stamp goes stale once the window passes", () => {
  vi.useFakeTimers();
  const stamp = new Date().toISOString();
  const { result } = renderHook(() => useStaleAfter(stamp, 10_000));
  expect(result.current).toBe(false);
  act(() => vi.advanceTimersByTime(10_001));
  expect(result.current).toBe(true);
});

test("a new stamp starts the clock over", () => {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ stamp }) => useStaleAfter(stamp, 10_000), {
    initialProps: { stamp: new Date().toISOString() },
  });
  act(() => vi.advanceTimersByTime(10_001));
  expect(result.current).toBe(true);
  rerender({ stamp: new Date().toISOString() });
  expect(result.current).toBe(false);
  act(() => vi.advanceTimersByTime(10_001));
  expect(result.current).toBe(true);
});

test("a stamp already older than the window is stale at once", () => {
  vi.useFakeTimers();
  const { result } = renderHook(() =>
    useStaleAfter(new Date(Date.now() - 60_000).toISOString(), 10_000),
  );
  expect(result.current).toBe(true);
});
