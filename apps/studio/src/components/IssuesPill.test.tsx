import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { editorStatusStore } from "./editorStatusStore";
import { IssuesPill } from "./IssuesPill";

const issues = [
  { nodeId: "hero", blockName: "Hero", fieldLabel: "Headline", message: "over the limit" },
];

afterEach(() => {
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("renders nothing while the draft is clean", () => {
  render(<IssuesPill apiRef={{ current: undefined }} />);
  expect(screen.queryByRole("button")).toBeNull();
});

test("issues arriving through the store surface the pill with its count", () => {
  render(<IssuesPill apiRef={{ current: undefined }} />);
  act(() => {
    editorStatusStore.set({ issues, issuesOpen: false, published: false });
  });
  const pill = screen.getByRole("button", { name: "Fix 1 issue" });
  expect(pill.getAttribute("aria-expanded")).toBe("false");
});

test("pressing the pill opens the dropdown; going to an issue closes it", () => {
  editorStatusStore.set({ issues, issuesOpen: false, published: false });
  render(<IssuesPill apiRef={{ current: undefined }} />);
  fireEvent.click(screen.getByRole("button", { name: "Fix 1 issue" }));
  expect(
    screen.getByRole("heading", { name: "1 thing needs fixing before this can go live" }),
  ).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: "Go to it →" }));
  expect(editorStatusStore.get().issuesOpen).toBe(false);
});

test("a refusal opening the store's flag opens the panel without a press", () => {
  render(<IssuesPill apiRef={{ current: undefined }} />);
  act(() => {
    editorStatusStore.set({ issues, issuesOpen: true, published: false });
  });
  expect(screen.getByText(/Your work is saved as-is\./)).toBeDefined();
});
