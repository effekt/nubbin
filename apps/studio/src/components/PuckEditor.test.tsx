import type { DocumentVersion } from "@nubbin/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { PuckEditor } from "./PuckEditor";

afterEach(() => {
  vi.unstubAllGlobals();
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
      initialData={{
        content: [{ type: "Hero", props: { id: "hero", headline: "The water tells you first" } }],
        root: { props: { title: "home" } },
      }}
      initialVersion={version}
    />,
  );
}

test("hosts Puck's editor shell around the draft", () => {
  vi.stubGlobal("fetch", () => Promise.resolve(Response.json({ ok: true })));
  renderEditor();
  // The canvas itself lives in Puck's iframe, which happy-dom does not compose into this
  // document — the chrome is what a unit test can see, and the dev-server check covers the
  // canvas. "Publish" is Puck's own header button, so its presence proves the shell mounted.
  expect(screen.getByText("Publish")).toBeDefined();
});

test("a refused publish lists the issues in author words, each a button", async () => {
  const issues = [
    { code: "invalid-props", message: "maximum 80 characters", at: "hero", path: "headline" },
  ];
  vi.stubGlobal("fetch", () =>
    Promise.resolve(Response.json({ ok: false, issues }, { status: 422 })),
  );
  renderEditor();
  fireEvent.click(screen.getByText("Publish"));
  const line = await screen.findByRole("button", {
    name: "Hero — Headline: maximum 80 characters",
  });
  expect(line).toBeDefined();
  expect(screen.getByRole("heading", { name: "Publishing was refused" })).toBeDefined();
  // Clicking selects the node in Puck; the canvas is out of reach here, so the click only
  // proves the button is wired without throwing. The dev-server check covers the selection.
  fireEvent.click(line);
});

test("a publish that lands confirms with the route and the demo's live page", async () => {
  vi.stubGlobal("fetch", () => {
    const landed = new Response("<html></html>", { status: 200 });
    Object.defineProperty(landed, "url", {
      value: "http://localhost:3001/preview?published=abc123",
    });
    return Promise.resolve(landed);
  });
  renderEditor();
  fireEvent.click(screen.getByText("Publish"));
  const status = await screen.findByRole("status");
  expect(status.textContent).toContain("abc123");
  expect(screen.getByRole("link", { name: "view it on the demo site" }).getAttribute("href")).toBe(
    "http://localhost:3000/",
  );
});
