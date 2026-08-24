import type { DocumentVersion } from "@nubbin/core";
import { afterEach, expect, test, vi } from "vitest";
import { postDraftSave } from "./postDraftSave";

afterEach(() => {
  vi.unstubAllGlobals();
});

const version: DocumentVersion = {
  documentId: "d1",
  version: 1,
  roots: [],
  elements: {},
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00.000Z",
  createdBy: "test",
};

test("posts the whole version as JSON and resolves undefined on a clean compile", async () => {
  const calls: [string, RequestInit | undefined][] = [];
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    calls.push([url, init]);
    return Promise.resolve(Response.json({ ok: true }));
  });
  await expect(postDraftSave("/", version)).resolves.toBeUndefined();
  const [url, init] = calls[0] ?? [];
  expect(url).toBe("/api/draft");
  expect(JSON.parse(String(init?.body))).toEqual({ route: "/", version });
});

test("a compile refusal resolves to the issues as lines — the draft was still saved", async () => {
  const reply = { ok: false, issues: [{ message: "expected a string", path: "headline" }] };
  vi.stubGlobal("fetch", () => Promise.resolve(Response.json(reply)));
  await expect(postDraftSave("/", version)).resolves.toEqual(["headline: expected a string"]);
});

test("an endpoint refusal resolves to its text", async () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(new Response("no draft for /nowhere", { status: 400 })),
  );
  await expect(postDraftSave("/nowhere", version)).resolves.toEqual(["no draft for /nowhere"]);
});

test("an empty refusal body still yields a line", async () => {
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("", { status: 500 })));
  await expect(postDraftSave("/", version)).resolves.toEqual(["save rejected (500)"]);
});
