import { describe, expect, test } from "vitest";
import { loadLiveRoutes } from "./loadLiveRoutes";
import { publishCommand } from "./publishCommand";
import { fixtureProject } from "./testing/fixtureProject";

describe("loadLiveRoutes", () => {
  test("keeps every pointer and the value its hash resolves to", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const { manifest, live } = await loadLiveRoutes(config.store);
    expect(manifest.routes).toHaveLength(1);
    expect(live[0]?.pointer.route).toBe("/pricing");
    expect(live[0]?.artifact?.hash).toBe(live[0]?.pointer.hash);
  });
});
