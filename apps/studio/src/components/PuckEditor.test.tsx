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
      routes={["/"]}
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
  // canvas. "Publish" is the studio's own header button (Puck's is overridden), so its
  // presence proves the shell mounted with the overrides applied.
  expect(screen.getByRole("button", { name: "Publish" }).tagName).toBe("BUTTON");
});

test("a refused publish lists the issues in author words, each a button", async () => {
  const issues = [
    { code: "invalid-props", message: "maximum 80 characters", at: "hero", path: "headline" },
  ];
  vi.stubGlobal("fetch", () =>
    Promise.resolve(Response.json({ ok: false, issues }, { status: 422 })),
  );
  renderEditor();
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
  const line = await screen.findByRole("button", {
    name: "Hero — Headline: maximum 80 characters",
  });
  expect(line).toBeDefined();
  expect(screen.getByRole("heading", { name: "Publishing was refused" })).toBeDefined();
  // Clicking selects the node in Puck; the canvas is out of reach here, so the click only
  // proves the button is wired without throwing. The dev-server check covers the selection.
  fireEvent.click(line);
});

test("a publish that lands confirms with the route and links the live page", async () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(Response.json({ ok: true, hash: "abc123", url: "http://localhost:3000/" })),
  );
  renderEditor();
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
  // Wait on the text, not the role: Puck mounts its own empty status region for drag
  // announcements, and findByRole("status") can resolve to that one before the notice lands.
  await screen.findByText(/abc123/);
  const statuses = screen.getAllByRole("status");
  expect(statuses.some((status) => status.textContent?.includes("abc123"))).toBe(true);
  expect(screen.getByRole("link", { name: "view the live page" }).getAttribute("href")).toBe(
    "http://localhost:3000/",
  );
});
