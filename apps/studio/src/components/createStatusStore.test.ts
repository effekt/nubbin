import { expect, test, vi } from "vitest";
import { createStatusStore } from "./createStatusStore";

test("holds the initial snapshot until set", () => {
  const store = createStatusStore({ count: 0 });
  expect(store.get()).toEqual({ count: 0 });
});

test("set replaces the snapshot and notifies every subscriber", () => {
  const store = createStatusStore(0);
  const first = vi.fn();
  const second = vi.fn();
  store.subscribe(first);
  store.subscribe(second);
  store.set(2);
  expect(store.get()).toBe(2);
  expect(first).toHaveBeenCalledTimes(1);
  expect(second).toHaveBeenCalledTimes(1);
});

test("an unsubscribed listener hears nothing more", () => {
  const store = createStatusStore(0);
  const listener = vi.fn();
  const unsubscribe = store.subscribe(listener);
  unsubscribe();
  store.set(1);
  expect(listener).not.toHaveBeenCalled();
});
