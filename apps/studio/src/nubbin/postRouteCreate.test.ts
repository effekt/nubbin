import { afterEach, expect, test, vi } from "vitest";
import { postRouteCreate } from "./postRouteCreate";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("posts the route as JSON and hands back the created outcome", async () => {
  const calls: { url: string; init: RequestInit | undefined }[] = [];
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return Promise.resolve(Response.json({ ok: true, route: "/x" }, { status: 201 }));
  });
  const outcome = await postRouteCreate("/x");
  expect(outcome).toEqual({ ok: true, route: "/x" });
  expect(calls[0]?.url).toBe("/api/routes");
  expect(JSON.parse(String(calls[0]?.init?.body))).toEqual({ route: "/x" });
});

test("a refusal comes back as its message", async () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(new Response("a page already lives at /x", { status: 409 })),
  );
  expect(await postRouteCreate("/x")).toEqual({
    ok: false,
    message: "a page already lives at /x",
  });
});
