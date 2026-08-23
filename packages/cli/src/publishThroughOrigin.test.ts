import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, test } from "vitest";
import { publishThroughOrigin } from "./publishThroughOrigin";

interface Received {
  url: string;
  body: string;
}

let running: Server | undefined;

const listen = async (status: number, received: Received[]): Promise<string> => {
  const server = createServer((request, response) => {
    let body = "";
    request.on("data", (chunk) => {
      body += String(chunk);
    });
    request.on("end", () => {
      received.push({ url: request.url ?? "", body });
      response.writeHead(status).end();
    });
  });
  running = server;
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
};

afterEach(() => running?.close());

describe("publishThroughOrigin", () => {
  test("posts the route and hash to the application's publish handler", async () => {
    const received: Received[] = [];
    const origin = await listen(200, received);
    await publishThroughOrigin(origin, "publish", { route: "/pricing", hash: "abc" });
    expect(received[0]?.url).toBe("/api/nubbin/publish");
    expect(JSON.parse(received[0]?.body ?? "{}")).toEqual({ route: "/pricing", hash: "abc" });
  });

  test("posts to the unpublish handler when that is the action", async () => {
    const received: Received[] = [];
    const origin = await listen(200, received);
    await publishThroughOrigin(origin, "unpublish", { route: "/pricing" });
    expect(received[0]?.url).toBe("/api/nubbin/unpublish");
  });

  test("says what answered and asks the obvious question when it refuses", async () => {
    const origin = await listen(404, []);
    await expect(
      publishThroughOrigin(origin, "publish", { route: "/pricing", hash: "abc" }),
    ).rejects.toThrow(/answered 404 — is the application running\?/);
  });
});
