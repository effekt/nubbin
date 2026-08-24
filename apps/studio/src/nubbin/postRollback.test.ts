import { afterEach, expect, test, vi } from "vitest";
import { postRollback } from "./postRollback";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("posts the route and hash as JSON and carries a success through", async () => {
  const calls: [string, RequestInit | undefined][] = [];
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    calls.push([url, init]);
    return Promise.resolve(
      Response.json({ ok: true, hash: "abc123", url: "http://localhost:3000/" }),
    );
  });
  await expect(postRollback("/", "abc123")).resolves.toEqual({
    ok: true,
    route: "/",
    hash: "abc123",
    url: "http://localhost:3000/",
  });
  const [url, init] = calls[0] ?? [];
  expect(url).toBe("/api/rollback");
  expect(init === undefined ? undefined : JSON.parse(String(init.body))).toEqual({
    route: "/",
    hash: "abc123",
  });
});

test("a drift refusal comes back as its issues, raw", async () => {
  const issues = [{ message: "Hero was compiled at version 1" }];
  vi.stubGlobal("fetch", () =>
    Promise.resolve(Response.json({ ok: false, issues }, { status: 422 })),
  );
  await expect(postRollback("/", "abc123")).resolves.toEqual({ ok: false, issues });
});

test("a plain-text refusal becomes one issue carrying the text", async () => {
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("no artifact abc", { status: 400 })));
  await expect(postRollback("/", "abc")).resolves.toEqual({
    ok: false,
    issues: [{ message: "no artifact abc" }],
  });
});
