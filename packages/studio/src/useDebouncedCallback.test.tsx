import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { useDebouncedCallback } from "./useDebouncedCallback";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("only the last call within the window fires, with its own arguments", () => {
  const calls: string[] = [];
  const { result } = renderHook(() =>
    useDebouncedCallback((value: string) => calls.push(value), 100),
  );
  result.current("first");
  result.current("second");
  vi.advanceTimersByTime(99);
  expect(calls).toEqual([]);
  vi.advanceTimersByTime(1);
  expect(calls).toEqual(["second"]);
});

test("unmounting clears the pending timer", () => {
  const calls: string[] = [];
  const { result, unmount } = renderHook(() =>
    useDebouncedCallback((value: string) => calls.push(value), 100),
  );
  result.current("pending");
  unmount();
  vi.advanceTimersByTime(200);
  expect(calls).toEqual([]);
});
