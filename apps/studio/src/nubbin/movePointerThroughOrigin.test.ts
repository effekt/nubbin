import { afterEach, expect, test, vi } from "vitest";
import { movePointerThroughOrigin } from "./movePointerThroughOrigin";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.NUBBIN_CONSUMER_ORIGIN;
});

test("posts the route and hash to the consumer's publish handler", async () => {
  process.env.NUBBIN_CONSUMER_ORIGIN = "http://consumer.test";
  const calls: Array<{ url: string; body: unknown }> = [];
  vi.stubGlobal("fetch", (url: URL, init: RequestInit) => {
    calls.push({ url: String(url), body: JSON.parse(String(init.body)) });
    return Promise.resolve(new Response("{}", { status: 200 }));
  });
  await movePointerThroughOrigin("/dispatches", "abc123");
  expect(calls).toEqual([
    {
      url: "http://consumer.test/api/nubbin/publish",
      body: { route: "/dispatches", hash: "abc123" },
    },
  ]);
});

test("a handler that refuses throws naming the endpoint and the status", async () => {
  process.env.NUBBIN_CONSUMER_ORIGIN = "http://consumer.test";
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("no", { status: 404 })));
  await expect(movePointerThroughOrigin("/", "abc")).rejects.toThrow(
    "http://consumer.test/api/nubbin/publish answered 404",
  );
});

test("an unreachable origin throws the same way as a refusal", async () => {
  process.env.NUBBIN_CONSUMER_ORIGIN = "http://consumer.test";
  vi.stubGlobal("fetch", () => Promise.reject(new Error("ECONNREFUSED")));
  await expect(movePointerThroughOrigin("/", "abc")).rejects.toThrow("could not be reached");
});
