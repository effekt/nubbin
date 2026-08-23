import { describe, expect, test } from "vitest";
import { publishCommand } from "./publishCommand";
import { statusCommand } from "./statusCommand";
import { fixtureProject } from "./testing/fixtureProject";

describe("statusCommand", () => {
  test("a store with nothing live says so, and still succeeds", async () => {
    const { config } = await fixtureProject();
    const outcome = await statusCommand(config, { positionals: [] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual(["nothing is live"]);
  });

  test("one live route prints its pointer", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const pointer = await config.store.pointer("/pricing");
    const outcome = await statusCommand(config, { positionals: [] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual([`/pricing -> ${pointer?.hash} (moved ${pointer?.updatedAt})`]);
  });

  test("several live routes print sorted by route, so two runs read the same", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    await publishCommand(config, { positionals: ["/extra-prop"] });
    await publishCommand(config, { positionals: ["/"] });
    // The store's own manifest happens to read this fixture in order, which would let a
    // missing sort pass — so hand back the pointers reversed and make the command earn it.
    const store = config.store;
    const shuffled = {
      ...store,
      manifest: async () => {
        const manifest = await store.manifest();
        return { ...manifest, routes: [...manifest.routes].reverse() };
      },
    };
    const outcome = await statusCommand({ ...config, store: shuffled }, { positionals: [] });
    const routes = outcome.lines.map((line) => line.split(" ")[0]);
    expect(routes).toEqual(["/", "/extra-prop", "/pricing"]);
  });

  test("a named route prints that pointer alone", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    await publishCommand(config, { positionals: ["/"] });
    const outcome = await statusCommand(config, { positionals: ["/pricing"] });
    expect(outcome.lines).toHaveLength(1);
    expect(outcome.lines[0]).toMatch(/^\/pricing -> /);
  });

  test("a named route with no pointer is an answer, not a failure", async () => {
    const { config } = await fixtureProject();
    const outcome = await statusCommand(config, { positionals: ["/pricing"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual(["nothing is live at /pricing"]);
  });
});
