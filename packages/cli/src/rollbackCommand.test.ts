import { createRegistry, defineBlock } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { ExitCode } from "./exitCode.constants";
import { publishCommand } from "./publishCommand";
import { rollbackCommand } from "./rollbackCommand";
import { fixtureProject } from "./testing/fixtureProject";
import { unpublishCommand } from "./unpublishCommand";

/** The fixture's Hero after a version bump — the registry a drifted rollback meets. */
const driftedRegistry = createRegistry([
  defineBlock({
    name: "Hero",
    schema: z.object({ title: z.string() }),
    component: null,
    version: 2,
    slots: {},
  }),
]);

describe("rollbackCommand", () => {
  test("points the route back at a stored artifact and says so", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const hash = (await config.store.pointer("/pricing"))?.hash ?? "";
    await unpublishCommand(config, { positionals: ["/pricing"] });
    const outcome = await rollbackCommand(config, { positionals: ["/pricing", hash] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual([`rolled back /pricing -> ${hash}`]);
    expect((await config.store.pointer("/pricing"))?.hash).toBe(hash);
  });

  test("refuses a hash the store does not hold, naming it", async () => {
    const { config } = await fixtureProject();
    await expect(
      rollbackCommand(config, { positionals: ["/pricing", "feedface"] }),
    ).rejects.toThrow(/feedface/);
  });

  test("refuses an artifact compiled for another route, naming both routes", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const hash = (await config.store.pointer("/pricing"))?.hash ?? "";
    await expect(rollbackCommand(config, { positionals: ["/", hash] })).rejects.toThrow(
      /\/pricing.*(?:\/(?:\s|$|,))|compiled for \/pricing/,
    );
  });

  test("refuses a drifted block, names it, and moves nothing", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const hash = (await config.store.pointer("/pricing"))?.hash ?? "";
    await unpublishCommand(config, { positionals: ["/pricing"] });
    const outcome = await rollbackCommand(
      { ...config, registry: driftedRegistry },
      { positionals: ["/pricing", hash] },
    );
    expect(outcome.code).toBe(ExitCode.Refused);
    const said = outcome.lines.join("\n");
    expect(said).toContain("/pricing");
    expect(said).toContain(hash);
    expect(said).toContain("Hero");
    expect(await config.store.pointer("/pricing")).toBeNull();
  });

  test("refuses when the hash is missing entirely", async () => {
    const { config } = await fixtureProject();
    await expect(rollbackCommand(config, { positionals: ["/pricing"] })).rejects.toThrow(
      /needs a hash/,
    );
  });
});
