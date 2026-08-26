import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { LiveStrip } from "./LiveStrip";

test("says what is live, links the proof, and words carry it — not a colour", () => {
  render(<LiveStrip url="http://localhost:3000/" onShowHistory={vi.fn()} />);
  expect(screen.getByRole("status").textContent).toContain("Live — published just now.");
  expect(screen.getByRole("link", { name: "View live ↗" }).getAttribute("href")).toBe(
    "http://localhost:3000/",
  );
});

test("the rollback affordance is a real button opening the history", () => {
  const onShowHistory = vi.fn();
  render(<LiveStrip url="http://localhost:3000/" onShowHistory={onShowHistory} />);
  fireEvent.click(screen.getByRole("button", { name: "Roll back to an earlier version…" }));
  expect(onShowHistory).toHaveBeenCalledTimes(1);
});
