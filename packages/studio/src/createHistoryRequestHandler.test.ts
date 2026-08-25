import { expect, test } from "vitest";
import { createHistoryRequestHandler } from "./createHistoryRequestHandler";

test("resolves the host route and serializes its history reply", async () => {
  const routes: string[] = [];
  const GET = createHistoryRequestHandler<{ slug?: string }>({
    route: (context) => `/${context.slug ?? ""}`,
    load: (route) => {
      routes.push(route);
      return {
        current: "abc123",
        moves: [{ hash: "abc123", documentVersion: 2, movedAt: "2026-08-25T12:00:00.000Z" }],
        total: 1,
      };
    },
  });
  const response = await GET(new Request("https://studio.test/api/history"), { slug: "pricing" });
  expect(routes).toEqual(["/pricing"]);
  expect(await response.json()).toEqual({
    current: "abc123",
    moves: [{ hash: "abc123", documentVersion: 2, movedAt: "2026-08-25T12:00:00.000Z" }],
    total: 1,
  });
});

test("supports asynchronous host route resolution and history lookup", async () => {
  const GET = createHistoryRequestHandler<Promise<string>>({
    route: async (context) => `/${await context}`,
    load: async () => ({ current: null, moves: null, total: 0 }),
  });
  const response = await GET(
    new Request("https://studio.test/api/history"),
    Promise.resolve("archive"),
  );
  expect(await response.json()).toEqual({ current: null, moves: null, total: 0 });
});
