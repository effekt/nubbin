import type { Artifact } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { doctorCommand } from "./doctorCommand";
import { publishCommand } from "./publishCommand";
import { fixtureProject } from "./testing/fixtureProject";

describe("doctorCommand", () => {
  test("a coherent empty project passes without requiring optional capabilities", async () => {
    const { config } = await fixtureProject();
    const outcome = await doctorCommand(config, { positionals: [] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toContain("✓ catalog and registry agree on 2 block(s)");
    expect(outcome.lines).toContain("✓ manifest has 0 unique live route(s)");
    expect(outcome.lines.at(-1)).toBe("doctor found no contract problems");
  });

  test("reports both directions of catalog and registry drift", async () => {
    const { config } = await fixtureProject();
    const prose = config.catalog.Hero;
    if (prose === undefined) throw new Error("fixture has no Hero catalog entry");
    const outcome = await doctorCommand(
      {
        ...config,
        catalog: { Prose: prose },
      },
      { positionals: [] },
    );
    expect(outcome.code).toBe(1);
    expect(outcome.lines.join("\n")).toContain("Prose is in the catalog but not the registry");
    expect(outcome.lines.join("\n")).toContain("Hero is in the registry but not the catalog");
    expect(outcome.lines.join("\n")).toContain("Section is in the registry but not the catalog");
  });

  test("includes unreadable live artifacts in its compatibility diagnosis", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const outcome = await doctorCommand(
      { ...config, store: { ...config.store, read: async () => null } },
      { positionals: [] },
    );
    expect(outcome.code).toBe(1);
    expect(outcome.lines.join("\n")).toContain("no artifact at this hash");
    expect(outcome.lines.at(-1)).toBe("doctor found 1 problem(s)");
  });

  test("reports malformed and duplicate pointers plus inconsistent artifacts", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const manifest = await config.store.manifest();
    const pointer = manifest.routes[0];
    if (pointer === undefined) throw new Error("fixture did not publish a pointer");
    const artifact = await config.store.read(pointer.hash);
    if (artifact === null) throw new Error("fixture did not write an artifact");
    const inconsistent: Artifact = { ...artifact, hash: "other", route: "/other" };
    const outcome = await doctorCommand(
      {
        ...config,
        store: {
          ...config.store,
          manifest: async () => ({
            ...manifest,
            routes: [
              { ...pointer, matchKind: "prefix" },
              { ...pointer, matchKind: "prefix" },
            ],
          }),
          read: async () => inconsistent,
        },
      },
      { positionals: [] },
    );
    const said = outcome.lines.join("\n");
    expect(outcome.code).toBe(1);
    expect(said).toContain("appears more than once");
    expect(said).toContain("has match kind prefix; its route requires exact");
    expect(said).toContain("resolved");
    expect(said).toContain("compiled for /other");
  });

  test("passes store failures through rather than diagnosing infrastructure", async () => {
    const { config } = await fixtureProject();
    const broken = new Error("storage unavailable");
    await expect(
      doctorCommand(
        { ...config, store: { ...config.store, manifest: async () => Promise.reject(broken) } },
        { positionals: [] },
      ),
    ).rejects.toBe(broken);
  });

  test("reads only", async () => {
    const { config } = await fixtureProject();
    const writes: string[] = [];
    await doctorCommand(
      {
        ...config,
        store: {
          ...config.store,
          write: async () => {
            writes.push("write");
          },
          publish: async () => {
            writes.push("publish");
          },
          unpublish: async () => {
            writes.push("unpublish");
          },
        },
      },
      { positionals: [] },
    );
    expect(writes).toEqual([]);
  });
});
