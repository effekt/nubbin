import { describe, expect, test } from "vitest";
import { publishCommand } from "./publishCommand";
import { fixtureProject } from "./testing/fixtureProject";

describe("publishCommand", () => {
  test("writes the artifact and moves the pointer to it", async () => {
    const { config } = await fixtureProject();
    const outcome = await publishCommand(config, { positionals: ["/pricing"] });
    const pointer = await config.store.pointer("/pricing");
    expect(outcome.code).toBe(0);
    expect(pointer?.hash).toBeDefined();
    expect(await config.store.read(pointer?.hash ?? "")).not.toBeNull();
  });

  test("says what it published, and to which hash", async () => {
    const { config } = await fixtureProject();
    const outcome = await publishCommand(config, { positionals: ["/pricing"] });
    const pointer = await config.store.pointer("/pricing");
    expect(outcome.lines[0]).toBe(`published /pricing -> ${pointer?.hash}`);
  });

  test("writes the artifact before moving the pointer, never the other way", async () => {
    const { config } = await fixtureProject();
    const order: string[] = [];
    const store = config.store;
    const watched = {
      ...store,
      write: async (artifact: Parameters<typeof store.write>[0]) => {
        order.push("write");
        return store.write(artifact);
      },
      publish: async (route: string, hash: string) => {
        order.push("publish");
        return store.publish(route, hash);
      },
    };
    await publishCommand({ ...config, store: watched }, { positionals: ["/pricing"] });
    expect(order).toEqual(["write", "publish"]);
  });

  test("publishes a document carrying an unknown key, and warns beside the answer", async () => {
    const { config } = await fixtureProject();
    const outcome = await publishCommand(config, { positionals: ["/extra-prop"] });
    expect(outcome.code).toBe(0);
    expect(outcome.warnings?.join("\n")).toContain("unknown-prop");
    expect(await config.store.pointer("/extra-prop")).not.toBeNull();
  });

  test("refuses a route with no document, and leaves the store untouched", async () => {
    const { config } = await fixtureProject();
    await expect(publishCommand(config, { positionals: ["/nowhere"] })).rejects.toThrow(
      /no document/,
    );
    expect((await config.store.manifest()).routes).toEqual([]);
  });
});
