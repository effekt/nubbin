import { render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { PublishPanel } from "./PublishPanel";
import { testStudioOperations } from "./testStudioOperations";

afterEach(() => {
  vi.unstubAllGlobals();
});

const landed = {
  ok: true,
  route: "/",
  hash: "abc123",
  url: "http://localhost:3000/",
  timings: { compileMs: 12, writeMs: 3, moveMs: 285 },
} as const;

function renderPanel(view: "history" | "publishing" | "published") {
  render(
    <PublishPanel
      view={view}
      route="/"
      operations={testStudioOperations}
      landed={view === "published" ? landed : undefined}
      onOutcome={vi.fn()}
      onShowHistory={vi.fn()}
    />,
  );
}

test("the history face is the history panel", () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(Response.json({ current: null, moves: [], total: 0 })),
  );
  renderPanel("history");
  expect(screen.getByRole("heading", { name: "Publish history" })).toBeTruthy();
});

test("publishing shows the three steps pending, no strip yet", () => {
  renderPanel("publishing");
  expect(screen.getByRole("heading", { name: "Publishing" })).toBeTruthy();
  expect(screen.getAllByText("…")).toHaveLength(3);
  expect(screen.queryByText(/Live — published just now/)).toBeNull();
});

test("published shows the checked steps with timings and the live strip", () => {
  renderPanel("published");
  expect(screen.getByRole("heading", { name: "Published" })).toBeTruthy();
  expect(screen.getAllByText("✓")).toHaveLength(3);
  expect(screen.getByText("0.3s")).toBeTruthy();
  expect(screen.getByText(/Live — published just now/)).toBeTruthy();
});
