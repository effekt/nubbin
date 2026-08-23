import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, test } from "vitest";
import { movePointer } from "./movePointer";
import { publishCommand } from "./publishCommand";
import { fixtureProject } from "./testing/fixtureProject";

let running: Server | undefined;

afterEach(() => running?.close());

const listen = async (received: string[]): Promise<string> => {
  const server = createServer((request, response) => {
    received.push(request.url ?? "");
    response.writeHead(200).end();
  });
  running = server;
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
};

describe("movePointer", () => {
  test("moves the pointer in the store when no origin is named", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const hash = (await config.store.pointer("/pricing"))?.hash ?? "";
    await movePointer(config, { positionals: [] }, "/", hash);
    expect((await config.store.pointer("/"))?.hash).toBe(hash);
  });

  test("publishes through the origin instead when one is named", async () => {
    const { config } = await fixtureProject();
    const received: string[] = [];
    const origin = await listen(received);
    await movePointer(config, { positionals: [], origin }, "/pricing", "abc");
    expect(received).toEqual(["/api/nubbin/publish"]);
    expect(await config.store.pointer("/pricing")).toBeNull();
  });
});
