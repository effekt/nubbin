import { afterEach, expect, test, vi } from "vitest";
import { postPublish } from "./postPublish";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("posts the route form-encoded, asking for JSON, and carries the reply through", async () => {
  const calls: [string, RequestInit | undefined][] = [];
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    calls.push([url, init]);
    return Promise.resolve(
      Response.json({ ok: true, hash: "abc123", url: "http://localhost:3000/" }),
    );
  });
  await expect(postPublish("/")).resolves.toEqual({
    ok: true,
    route: "/",
    hash: "abc123",
    url: "http://localhost:3000/",
  });
  const [url, init] = calls[0] ?? [];
  expect(url).toBe("/api/publish");
  expect(String(init?.body)).toBe("route=%2F");
  expect(new Headers(init?.headers).get("accept")).toBe("application/json");
});

test("a 2xx that is not the contract's shape refuses rather than fabricating a link", async () => {
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("<html></html>", { status: 200 })));
  await expect(postPublish("/")).resolves.toEqual({
    ok: false,
    issues: [{ message: "the publish endpoint answered with an unrecognised reply" }],
  });
});

test("a compiler refusal comes back as its issues, raw", async () => {
  const issues = [{ code: "invalid-props", message: "expected a string", at: "n1", path: "x" }];
  vi.stubGlobal("fetch", () =>
    Promise.resolve(Response.json({ ok: false, issues }, { status: 422 })),
  );
  await expect(postPublish("/")).resolves.toEqual({ ok: false, issues });
});

test("a plain-text refusal becomes one issue carrying the text", async () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(new Response("no draft for /nowhere", { status: 400 })),
  );
  await expect(postPublish("/nowhere")).resolves.toEqual({
    ok: false,
    issues: [{ message: "no draft for /nowhere" }],
  });
});

test("an empty refusal still yields a message", async () => {
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("", { status: 500 })));
  await expect(postPublish("/")).resolves.toEqual({
    ok: false,
    issues: [{ message: "publish rejected (500)" }],
  });
});
