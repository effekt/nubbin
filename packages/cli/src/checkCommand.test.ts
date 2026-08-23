import { type Artifact, createRegistry, defineBlock } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { checkCommand } from "./checkCommand";
import { publishCommand } from "./publishCommand";
import { fixtureProject } from "./testing/fixtureProject";

// The same block the fixture registers, one version on — what merging a schema change looks
// like to a page that is already live.
const heroMovedOn = defineBlock({
  name: "Hero",
  schema: z.object({ title: z.string() }),
  component: null,
  version: 2,
  slots: {},
});

describe("checkCommand", () => {
  test("a clean store reports zero checked, and passes", async () => {
    const { config } = await fixtureProject();
    const outcome = await checkCommand(config, { positionals: [] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines.join("\n")).toContain("0 live route pointer(s) checked");
  });

  test("every live route compatible: says how many it cleared, and exits done", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    await publishCommand(config, { positionals: ["/"] });
    const outcome = await checkCommand(config, { positionals: [] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines.join("\n")).toContain("2 live route pointer(s) checked");
  });

  test("a live route on a block that changed version refuses, naming the block", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const drifted = { ...config, registry: createRegistry([heroMovedOn]) };
    const outcome = await checkCommand(drifted, { positionals: [] });
    expect(outcome.code).toBe(1);
    expect(outcome.lines.join("\n")).toContain("Hero");
    expect(outcome.lines.join("\n")).toContain("/pricing");
  });

  test("a hash the store cannot read is reported, never filtered out", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const blind = { ...config, store: { ...config.store, read: async () => null } };
    const outcome = await checkCommand(blind, { positionals: [] });
    expect(outcome.code).toBe(1);
    expect(outcome.lines.join("\n")).toContain("no artifact at this hash");
  });

  test("reads only — it never writes and never moves a pointer", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const written: string[] = [];
    const store = config.store;
    const watched = {
      ...store,
      write: async (artifact: Artifact) => {
        written.push("write");
        return store.write(artifact);
      },
      publish: async (route: string, hash: string) => {
        written.push("publish");
        return store.publish(route, hash);
      },
      unpublish: async (route: string) => {
        written.push("unpublish");
        return store.unpublish(route);
      },
    };
    await checkCommand({ ...config, store: watched }, { positionals: [] });
    expect(written).toEqual([]);
  });
});
