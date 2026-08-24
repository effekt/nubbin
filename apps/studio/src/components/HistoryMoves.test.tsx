import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { HistoryMoves } from "./HistoryMoves";

function move(n: number) {
  return { hash: `hash${n}xxxx`, documentVersion: n, movedAt: `2026-08-0${n}T00:00:00Z` };
}

test("null moves name the store's gap rather than reading as an empty log", () => {
  render(<HistoryMoves reply={{ current: null, moves: null, total: 0 }} onRollback={vi.fn()} />);
  expect(screen.getByText(/keeps no history/)).toBeTruthy();
});

test("an empty log says nothing was published", () => {
  render(<HistoryMoves reply={{ current: null, moves: [], total: 0 }} onRollback={vi.fn()} />);
  expect(screen.getByText("Nothing has been published here yet.")).toBeTruthy();
});

test("rows render in the order given and the live hash is the one marked current", () => {
  const reply = { current: "hash2xxxx", moves: [move(2), move(1)], total: 2 };
  render(<HistoryMoves reply={reply} onRollback={vi.fn()} />);
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getAllByText("current")).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Live now" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Roll back" })).toBeTruthy();
});

test("a capped list says how much of the log it shows", () => {
  const reply = { current: "hash2xxxx", moves: [move(2), move(1)], total: 25 };
  render(<HistoryMoves reply={reply} onRollback={vi.fn()} />);
  expect(screen.getByText("Showing the last 2 of 25 moves.")).toBeTruthy();
});
