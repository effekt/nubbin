import { afterEach, expect, test, vi } from "vitest";
import { getHistory } from "./getHistory";

afterEach(() => {
  vi.unstubAllGlobals();
});

const reply = {
  current: "a1",
  moves: [{ hash: "a1", documentVersion: 1, movedAt: "2026-08-24" }],
  total: 1,
};

test("fetches the route's prefixed endpoint and carries the reply through", async () => {
  const urls: string[] = [];
  vi.stubGlobal("fetch", (url: string) => {
    urls.push(url);
    return Promise.resolve(Response.json(reply));
  });
  await expect(getHistory("/dispatches")).resolves.toEqual(reply);
  expect(urls).toEqual(["/api/history/dispatches"]);
});

test("the root route maps to the bare prefix", async () => {
  const urls: string[] = [];
  vi.stubGlobal("fetch", (url: string) => {
    urls.push(url);
    return Promise.resolve(Response.json(reply));
  });
  await getHistory("/");
  expect(urls).toEqual(["/api/history"]);
});

test("a non-ok reply, an unrecognised body and a network failure all read as undefined", async () => {
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("gone", { status: 500 })));
  await expect(getHistory("/")).resolves.toBeUndefined();
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("<html></html>", { status: 200 })));
  await expect(getHistory("/")).resolves.toBeUndefined();
  vi.stubGlobal("fetch", () => Promise.reject(new Error("refused")));
  await expect(getHistory("/")).resolves.toBeUndefined();
});
