import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RepeaterRowActions } from "./RepeaterRowActions";

function renderActions(index: number, count: number, minItems?: number) {
  const onMove = vi.fn();
  const onRemove = vi.fn();
  render(
    <RepeaterRowActions
      index={index}
      count={count}
      minItems={minItems}
      readOnly={false}
      onMove={onMove}
      onRemove={onRemove}
    />,
  );
  return { onMove, onRemove };
}

test("the move buttons step one row, and the ends disable their own direction", () => {
  const { onMove } = renderActions(1, 3);
  fireEvent.click(screen.getByRole("button", { name: "Move row up" }));
  expect(onMove).toHaveBeenCalledWith(1, 0);
  fireEvent.click(screen.getByRole("button", { name: "Move row down" }));
  expect(onMove).toHaveBeenCalledWith(1, 2);
});

test("the first row cannot move up nor the last down", () => {
  renderActions(0, 1);
  expect(screen.getByRole("button", { name: "Move row up" }).hasAttribute("disabled")).toBe(true);
  expect(screen.getByRole("button", { name: "Move row down" }).hasAttribute("disabled")).toBe(true);
});

test("remove works above the min and carries the reason at it", () => {
  const { onRemove } = renderActions(0, 3, 2);
  fireEvent.click(screen.getByRole("button", { name: "Remove row" }));
  expect(onRemove).toHaveBeenCalledOnce();
  renderActions(0, 2, 2);
  const removes = screen.getAllByRole("button", { name: "Remove row" });
  const atMin = removes[removes.length - 1];
  expect(atMin?.hasAttribute("disabled")).toBe(true);
  expect(atMin?.getAttribute("title")).toBe("This list needs at least 2.");
});
