import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { HistoryRow } from "./HistoryRow";

const move = { hash: "4a1627269bd1c9a0", documentVersion: 3, movedAt: "2026-08-24T14:03:22Z" };

function renderRow(current: boolean, onRollback = vi.fn()) {
  render(
    <ul>
      <HistoryRow move={move} current={current} onRollback={onRollback} />
    </ul>,
  );
  return onRollback;
}

test("a row shows the short hash as code, the time, and no current mark", () => {
  renderRow(false);
  const hash = screen.getByText("4a162726");
  expect(hash.tagName).toBe("CODE");
  expect(screen.getByText("2026-08-24 14:03").tagName).toBe("TIME");
  expect(screen.queryByText("current")).toBeNull();
});

test("the current row says so in words and its control is disabled with the reason", () => {
  renderRow(true);
  expect(screen.getByText("current")).toBeTruthy();
  const control = screen.getByRole("button", { name: "Live now" });
  expect(control.hasAttribute("disabled")).toBe(true);
});

test("one press only arms the confirm — nothing fires", () => {
  const onRollback = renderRow(false);
  fireEvent.click(screen.getByRole("button", { name: "Roll back" }));
  expect(onRollback).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Confirm roll back" })).toBeTruthy();
});

test("the second press fires the rollback with the full hash, then waits", () => {
  const onRollback = renderRow(false);
  fireEvent.click(screen.getByRole("button", { name: "Roll back" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm roll back" }));
  expect(onRollback).toHaveBeenCalledWith("4a1627269bd1c9a0");
  const control = screen.getByRole("button", { name: "Rolling back…" });
  expect(control.hasAttribute("disabled")).toBe(true);
});
