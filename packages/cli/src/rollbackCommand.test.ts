import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createRegistry, defineBlock } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { ExitCode } from "./exitCode.constants";
import { publishCommand } from "./publishCommand";
import { rollbackCommand } from "./rollbackCommand";
import { fixtureDocument } from "./testing/fixtureDocument";
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

  test("--to a document version resolves through history and moves the pointer", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const hash = (await config.store.pointer("/pricing"))?.hash ?? "";
    const versionTwo = {
      ...fixtureDocument("pricing", {
        n1: { id: "n1", block: "Hero", props: { title: "New plans" } },
      }),
      version: 2,
    };
    await publishCommand({ ...config, document: () => versionTwo }, { positionals: ["/pricing"] });
    const outcome = await rollbackCommand(config, { positionals: ["/pricing"], to: "1" });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual([`rolled back /pricing -> ${hash}`]);
    expect((await config.store.pointer("/pricing"))?.hash).toBe(hash);
  });

  test("refuses when the hash is missing entirely", async () => {
    const { config } = await fixtureProject();
    await expect(rollbackCommand(config, { positionals: ["/pricing"] })).rejects.toThrow(
      /needs a hash/,
    );
  });

  // The store addresses artifacts by the full 16-hex-digit hash and resolves nothing shorter,
  // so an abbreviated hash in the README is an example that cannot run as printed.
  test("the README's example carries a hash the store could actually resolve", async () => {
    const readme = await readFile(resolve(import.meta.dirname, "..", "README.md"), "utf8");
    const example = readme.match(/nubbin rollback \/pricing (\S+)/);
    expect(example?.[1]).toMatch(/^[0-9a-f]{16}$/);
  });
});
