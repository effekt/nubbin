"use client";

import { useState } from "react";
import { withItemMoved } from "./withItemMoved";

export interface RowKeys {
  keys: readonly string[];
  insert: (index: number) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
}

/** Generated keys for repeater rows, stable across reorder — the wireframes' rule, because
 * index keys re-mount every row and steal focus. The ops mirror the value ops they ride
 * beside: a moved row keeps its key, an added one mints a fresh one. When the value changes
 * under the hook — undo, an external edit — the keys resize from the end rather than guess. */
export function useRowKeys(count: number): RowKeys {
  const [keys, setKeys] = useState<readonly string[]>(() =>
    Array.from({ length: count }, () => crypto.randomUUID()),
  );
  if (keys.length !== count) {
    setKeys(
      keys.length < count
        ? [...keys, ...Array.from({ length: count - keys.length }, () => crypto.randomUUID())]
        : keys.slice(0, count),
    );
  }
  return {
    keys,
    insert: (index) =>
      setKeys((k) => [...k.slice(0, index), crypto.randomUUID(), ...k.slice(index)]),
    remove: (index) => setKeys((k) => [...k.slice(0, index), ...k.slice(index + 1)]),
    move: (from, to) => setKeys((k) => withItemMoved(k, from, to)),
  };
}
