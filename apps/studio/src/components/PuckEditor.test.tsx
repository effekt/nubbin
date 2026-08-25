import type { DocumentVersion } from "@nubbin/core";
import studioConfig from "@nubbin/studio-config";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { editorStatusStore } from "./editorStatusStore";
import { PuckEditor } from "./PuckEditor";

afterEach(() => {
  vi.unstubAllGlobals();
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

const version: DocumentVersion = {
  documentId: "home",
  version: 1,
  roots: ["hero"],
  elements: {
    hero: { id: "hero", block: "Hero", props: { headline: "The water tells you first" } },
  },
  meta: { title: "home" },
  createdAt: "2026-01-01T00:00:00.000Z",
  createdBy: "test",
};

function renderEditor() {
  return render(
    <PuckEditor
      route="/"
      routes={["/"]}
      initialData={{
        content: [{ type: "Hero", props: { id: "hero", headline: "The water tells you first" } }],
        root: { props: { title: "home" } },
      }}
      initialVersion={version}
      consumerOrigin="http://localhost:3100"
    />,
  );
}

test("hosts Puck's editor shell around the draft, assuming changes on first load", () => {
  vi.stubGlobal("fetch", () => Promise.resolve(Response.json({ ok: true })));
  renderEditor();
  // The canvas itself lives in Puck's iframe, which happy-dom does not compose into this
  // document — the chrome is what a unit test can see, and the dev-server check covers the
  // canvas. "Publish changes" is the studio's own header button (Puck's is overridden), so
  // its presence proves the shell mounted with the overrides applied and the label seam live.
  expect(screen.getByRole("button", { name: "Publish changes" }).tagName).toBe("BUTTON");
  expect(screen.queryByRole("button", { name: /Fix .* issue/ })).toBeNull();
});

test("a refused publish fills the pill and opens its dropdown on the issues", async () => {
  const issues = [
    { code: "invalid-props", message: "maximum 60 characters", at: "hero", path: "headline" },
  ];
  vi.stubGlobal("fetch", () =>
    Promise.resolve(Response.json({ ok: false, issues }, { status: 422 })),
  );
  renderEditor();
  fireEvent.click(screen.getByRole("button", { name: "Publish changes" }));
  expect(await screen.findByRole("button", { name: "Fix 1 issue" })).toBeDefined();
  expect(
    screen.getByRole("heading", { name: "1 thing needs fixing before this can go live" }),
  ).toBeDefined();
  expect(screen.getByText("Hero — Headline:")).toBeDefined();
  expect(screen.getByText("maximum 60 characters")).toBeDefined();
  // Going to the issue closes the panel; the canvas is out of reach here, so the click only
  // proves the button is wired without throwing. The dev-server check covers the selection.
  fireEvent.click(screen.getByRole("button", { name: "Go to it →" }));
  expect(editorStatusStore.get().issuesOpen).toBe(false);
});

test("a publish that lands reports inside the header's panel and flips the label", async () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(
      Response.json({
        ok: true,
        hash: "abc123",
        url: "http://localhost:3000/",
        timings: { compileMs: 12, writeMs: 3, moveMs: 285 },
      }),
    ),
  );
  renderEditor();
  fireEvent.click(screen.getByRole("button", { name: "Publish changes" }));
  await screen.findByText("Switched the live page over");
  expect(screen.getByText("0.3s")).toBeDefined();
  expect(screen.getByRole("link", { name: "View live ↗" }).getAttribute("href")).toBe(
    "http://localhost:3000/",
  );
  expect(screen.getByRole("button", { name: "Published ✓" })).toBeDefined();
});

test("the viewport chips are the consumer's breakpoints, not Puck's invented three", () => {
  vi.stubGlobal("fetch", () => Promise.resolve(Response.json({ ok: true })));
  renderEditor();
  // Puck's viewport buttons live in the editor chrome, not the canvas iframe, so the unit
  // test can see them. Each button's title carries the viewport's label, which proves the
  // viewports prop reached Puck; the chip's visible text is the icon string — the same name.
  for (const viewport of studioConfig.viewports) {
    expect(screen.getByTitle(`Switch to ${String(viewport.label)} viewport`)).toBeDefined();
  }
  expect(screen.queryByTitle("Switch to Small viewport")).toBeNull();
});
