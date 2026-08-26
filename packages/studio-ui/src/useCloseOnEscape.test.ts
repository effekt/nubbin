import { renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useCloseOnEscape } from "./useCloseOnEscape";

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

test("Escape closes while active", () => {
  const close = vi.fn();
  renderHook(() => useCloseOnEscape(true, close));
  pressEscape();
  expect(close).toHaveBeenCalledTimes(1);
});

test("inactive, the listener is not there to swallow keys", () => {
  const close = vi.fn();
  const { unmount } = renderHook(() => useCloseOnEscape(false, close));
  pressEscape();
  unmount();
  pressEscape();
  expect(close).not.toHaveBeenCalled();
});

test("other keys close nothing", () => {
  const close = vi.fn();
  renderHook(() => useCloseOnEscape(true, close));
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
  expect(close).not.toHaveBeenCalled();
});
