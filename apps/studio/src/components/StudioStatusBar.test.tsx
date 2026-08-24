import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { editorStatusStore } from "./editorStatusStore";
import { StudioStatusBar } from "./StudioStatusBar";

afterEach(() => {
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("unproven state reads as edits not yet live, with nothing it cannot prove", () => {
  render(<StudioStatusBar />);
  expect(screen.getByText("Newer edits not live yet")).toBeDefined();
  expect(screen.queryByText(/to fix before publish/)).toBeNull();
  expect(screen.queryByText("Draft autosaved")).toBeNull();
});

test("a landed publish, standing issues and a landed save each surface live", () => {
  render(<StudioStatusBar />);
  act(() =>
    editorStatusStore.set({
      issues: [{ message: "The headline is over its limit." }],
      issuesOpen: false,
      published: true,
      savedAt: "2026-08-24T14:00:00.000Z",
    }),
  );
  expect(screen.getByText("Published · up to date")).toBeDefined();
  expect(screen.getByText("1 to fix before publish")).toBeDefined();
  expect(screen.getByText("Draft autosaved")).toBeDefined();
});

test("is a labelled region, so assistive tech can land on the page's status", () => {
  render(<StudioStatusBar />);
  expect(screen.getByRole("region", { name: "Page status" })).toBeDefined();
});
