import type { DocumentVersion } from "@nubbin/core";
import { render, screen } from "@testing-library/react";
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

test("hosts Puck's editor shell around the draft", () => {
  vi.stubGlobal("fetch", () => Promise.resolve(Response.json({ ok: true })));
  render(
    <PuckEditor
      route="/"
      initialData={{
        content: [{ type: "Hero", props: { id: "hero", headline: "The water tells you first" } }],
        root: { props: { title: "home" } },
      }}
      initialVersion={version}
    />,
  );
  // The canvas itself lives in Puck's iframe, which happy-dom does not compose into this
  // document — the chrome is what a unit test can see, and the dev-server check covers the
  // canvas. "Publish" is Puck's own header button, so its presence proves the shell mounted.
  expect(screen.getByText("Publish")).toBeDefined();
});
