import { describe, expect, test } from "vitest";
import { publishCommand } from "./publishCommand";
import { fixtureProject } from "./testing/fixtureProject";
import { unpublishCommand } from "./unpublishCommand";

describe("unpublishCommand", () => {
  test("drops the pointer and says which route it dropped", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const outcome = await unpublishCommand(config, { positionals: ["/pricing"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual(["unpublished /pricing"]);
    expect(await config.store.pointer("/pricing")).toBeNull();
  });

  test("leaves the artifact readable — unpublishing drops a pointer, never an artifact", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const hash = (await config.store.pointer("/pricing"))?.hash ?? "";
    await unpublishCommand(config, { positionals: ["/pricing"] });
    expect(await config.store.read(hash)).not.toBeNull();
  });

  test("refuses a route with nothing live, before anything is dropped", async () => {
    const { config } = await fixtureProject();
    await expect(unpublishCommand(config, { positionals: ["/pricing"] })).rejects.toThrow(
      /nothing is live at \/pricing/,
    );
  });

  test("refuses when the route is missing entirely", async () => {
    const { config } = await fixtureProject();
    await expect(unpublishCommand(config, { positionals: [] })).rejects.toThrow(/needs a route/);
  });
});
