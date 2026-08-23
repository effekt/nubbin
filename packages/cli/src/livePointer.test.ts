import { describe, expect, test } from "vitest";
import { livePointer } from "./livePointer";
import { publishCommand } from "./publishCommand";
import { fixtureProject } from "./testing/fixtureProject";

describe("livePointer", () => {
  test("returns the pointer live behind the route positional", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const pointer = await livePointer(config, { positionals: ["/pricing"] });
    expect(pointer.route).toBe("/pricing");
    expect(pointer.hash).toBeDefined();
  });

  test("refuses a route with nothing live, naming it", async () => {
    const { config } = await fixtureProject();
    await expect(livePointer(config, { positionals: ["/pricing"] })).rejects.toThrow(
      /nothing is live at \/pricing/,
    );
  });

  test("refuses when the route positional is missing", async () => {
    const { config } = await fixtureProject();
    await expect(livePointer(config, { positionals: [] })).rejects.toThrow(/needs a route/);
  });
});
