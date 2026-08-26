import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { expect, test } from "vitest";
import { useRowKeys } from "./useRowKeys";

/** The hook's contract: an op rides in the same event as the value change it mirrors, so
 * React batches both into one render — which this harness reproduces, where calling an op
 * with the count held still would read as an external resize instead. */
function useRowKeysHarness(initial: number) {
  const [count, setCount] = useState(initial);
  const rowKeys = useRowKeys(count);
  return {
    keys: rowKeys.keys,
    move: rowKeys.move,
    insert: (index: number) => {
      rowKeys.insert(index);
      setCount(count + 1);
    },
    remove: (index: number) => {
      rowKeys.remove(index);
      setCount(count - 1);
    },
  };
}

test("a moved row keeps its key — the wireframes' stable-identity rule", () => {
  const { result } = renderHook(() => useRowKeysHarness(3));
  const [first, second, third] = result.current.keys;
  act(() => result.current.move(0, 2));
  expect(result.current.keys).toEqual([second, third, first]);
});

test("an inserted row mints a fresh key without disturbing its neighbours", () => {
  const { result } = renderHook(() => useRowKeysHarness(2));
  const before = [...result.current.keys];
  act(() => result.current.insert(1));
  expect(result.current.keys).toHaveLength(3);
  expect(result.current.keys[0]).toBe(before[0]);
  expect(result.current.keys[2]).toBe(before[1]);
  expect(before).not.toContain(result.current.keys[1]);
});

test("a removed row takes only its own key with it", () => {
  const { result } = renderHook(() => useRowKeysHarness(3));
  const [first, , third] = result.current.keys;
  act(() => result.current.remove(1));
  expect(result.current.keys).toEqual([first, third]);
});

test("a value resized under the hook regrows or trims from the end", () => {
  const { result, rerender } = renderHook(({ count }) => useRowKeys(count), {
    initialProps: { count: 2 },
  });
  const before = [...result.current.keys];
  rerender({ count: 3 });
  expect(result.current.keys.slice(0, 2)).toEqual(before);
  expect(result.current.keys).toHaveLength(3);
  rerender({ count: 1 });
  expect(result.current.keys).toEqual([before[0]]);
});
