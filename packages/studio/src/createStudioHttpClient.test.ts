import type { DocumentVersion } from "@nubbin/core";
import { expect, test, vi } from "vitest";
import { createStudioHttpClient } from "./createStudioHttpClient";

const version: DocumentVersion = {
  documentId: "d1",
  version: 1,
  roots: [],
  elements: {},
  meta: { title: "Test" },
  createdAt: "2026-01-01T00:00:00.000Z",
  createdBy: "test",
};

test("uses a configured origin and host-owned fetch for draft saves", async () => {
  const request = vi.fn<typeof fetch>(() => Promise.resolve(Response.json({ ok: true })));
  const client = createStudioHttpClient({ baseUrl: "https://studio.example/", fetch: request });

  await expect(client.saveDraft("/about", version)).resolves.toBeUndefined();
  expect(request).toHaveBeenCalledWith(
    "https://studio.example/api/draft",
    expect.objectContaining({ method: "POST", body: JSON.stringify({ route: "/about", version }) }),
  );
});

test("speaks the publish and rollback outcome contract", async () => {
  const request = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ hash: "a1", url: "/about" }))
    .mockResolvedValueOnce(Response.json({ issues: [{ message: "drifted" }] }, { status: 409 }));
  const client = createStudioHttpClient({ fetch: request });

  await expect(client.publish("/about")).resolves.toEqual({
    ok: true,
    route: "/about",
    hash: "a1",
    url: "/about",
  });
  await expect(client.rollback("/about", "old")).resolves.toEqual({
    ok: false,
    issues: [{ message: "drifted" }],
  });
});

test("maps root and nested history routes without inventing a trailing slash", async () => {
  const reply = { current: null, moves: null, total: 0 };
  const request = vi.fn<typeof fetch>(() => Promise.resolve(Response.json(reply)));
  const client = createStudioHttpClient({ baseUrl: "/studio", fetch: request });

  await expect(client.history("/")).resolves.toEqual(reply);
  await expect(client.history("/about")).resolves.toEqual(reply);
  expect(request.mock.calls.map(([url]) => url)).toEqual([
    "/studio/api/history",
    "/studio/api/history/about",
  ]);
});

test("degrades network and malformed history replies to an unavailable history", async () => {
  const request = vi
    .fn<typeof fetch>()
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(new Response("<html></html>"));
  const client = createStudioHttpClient({ fetch: request });

  await expect(client.history("/")).resolves.toBeUndefined();
  await expect(client.history("/")).resolves.toBeUndefined();
});
