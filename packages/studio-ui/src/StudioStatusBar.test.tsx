import { editorStatusStore } from "@nubbin/studio";
import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { StudioStatusBar } from "./StudioStatusBar";

afterEach(() => {
  vi.useRealTimers();
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("unproven state reads as edits not yet live, with nothing it cannot prove", () => {
  render(<StudioStatusBar />);
  expect(screen.getByText("Newer edits not live yet")).toBeDefined();
  expect(screen.queryByText(/to fix before publish/)).toBeNull();
  expect(screen.queryByText(/Autosaved/)).toBeNull();
  expect(screen.queryByText(/Preview/)).toBeNull();
});

test("a landed publish, standing issues and a landed save each surface live", () => {
  render(<StudioStatusBar />);
  act(() =>
    editorStatusStore.set({
      issues: [{ message: "The headline is over its limit." }],
      issuesOpen: false,
      published: true,
      savedAt: new Date().toISOString(),
      frameLoaded: true,
    }),
  );
  expect(screen.getByText("Published · up to date")).toBeDefined();
  expect(screen.getByText("1 to fix before publish")).toBeDefined();
  expect(screen.getByText("Autosaved just now")).toBeDefined();
  expect(screen.getByText("Preview connected")).toBeDefined();
});

test("the autosave note settles to Autosaved once the save is no longer just now", () => {
  vi.useFakeTimers();
  render(<StudioStatusBar />);
  act(() =>
    editorStatusStore.set({
      issues: [],
      issuesOpen: false,
      published: false,
      savedAt: new Date().toISOString(),
    }),
  );
  expect(screen.getByText("Autosaved just now")).toBeDefined();
  act(() => vi.advanceTimersByTime(10_001));
  expect(screen.getByText("Autosaved")).toBeDefined();
  expect(screen.queryByText("Autosaved just now")).toBeNull();
});

test("a failed save round trip flips the preview segment to a warning", () => {
  render(<StudioStatusBar />);
  act(() =>
    editorStatusStore.set({
      issues: [],
      issuesOpen: false,
      published: false,
      frameLoaded: true,
      saveFailed: true,
    }),
  );
  expect(screen.getByText("Preview unreachable")).toBeDefined();
  expect(screen.queryByText("Preview connected")).toBeNull();
});

test("is a labelled region, so assistive tech can land on the page's status", () => {
  render(<StudioStatusBar />);
  expect(screen.getByRole("region", { name: "Page status" })).toBeDefined();
});
