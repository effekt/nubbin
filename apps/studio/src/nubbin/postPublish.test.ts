import { afterEach, expect, test, vi } from "vitest";
import { postPublish } from "./postPublish";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("posts the route form-encoded and reads the hash off the followed redirect", async () => {
  const calls: [string, RequestInit | undefined][] = [];
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    calls.push([url, init]);
    const landed = new Response("<html></html>", { status: 200 });
    Object.defineProperty(landed, "url", {
      value: "http://localhost:3001/preview?published=abc123",
    });
    return Promise.resolve(landed);
  });
  await expect(postPublish("/")).resolves.toBe("published abc123");
  const [url, init] = calls[0] ?? [];
  expect(url).toBe("/api/publish");
  expect(String(init?.body)).toBe("route=%2F");
});

test("a refusal resolves to the endpoint's own text", async () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(new Response("no draft for /nowhere", { status: 400 })),
  );
  await expect(postPublish("/nowhere")).resolves.toBe("no draft for /nowhere");
});

test("an empty refusal still yields a message", async () => {
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("", { status: 500 })));
  await expect(postPublish("/")).resolves.toBe("publish rejected (500)");
});
