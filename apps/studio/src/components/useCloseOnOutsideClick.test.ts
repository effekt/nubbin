import { renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";

function press(target: Node) {
  const event = new MouseEvent("mousedown", { bubbles: true });
  Object.defineProperty(event, "target", { value: target });
  document.dispatchEvent(event);
}

function setup(active: boolean) {
  const inside = document.createElement("div");
  document.body.appendChild(inside);
  const close = vi.fn();
  const utils = renderHook(() => useCloseOnOutsideClick(active, { current: inside }, close));
  return { inside, close, utils };
}

test("a press outside closes", () => {
  const { close } = setup(true);
  press(document.body);
  expect(close).toHaveBeenCalledTimes(1);
});

test("a press inside does not", () => {
  const { inside, close } = setup(true);
  press(inside);
  expect(close).not.toHaveBeenCalled();
});

test("inactive, the listener is not there to swallow clicks", () => {
  const { close, utils } = setup(false);
  press(document.body);
  utils.unmount();
  press(document.body);
  expect(close).not.toHaveBeenCalled();
});
