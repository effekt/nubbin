import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { promisify } from "node:util";
import type { Artifact } from "@nubbin/core";
import { createFsArtifactStore } from "@nubbin/store-fs";
import { beforeAll, describe, expect, test } from "vitest";
import { loadConfig } from "./loadConfig";
import { runCli } from "./runCli";
import { fixtureDocument } from "./testing/fixtureDocument";
import { linkedConsumer } from "./testing/linkedConsumer";

const run = promisify(execFile);

/** The compiler this package tests with, run as a consumer would run theirs. */
const TSC = createRequire(import.meta.url).resolve("typescript/lib/tsc.js");

/** An artifact as a store would hold one, written straight in to seed what `status` reads. */
const SEEDED: Artifact = {
  hash: "f00dfeedf00dfeed",
  route: "/pricing",
  documentId: "pricing",
  documentVersion: 1,
  blockVersions: {},
  tree: [],
  meta: { title: "Plans" },
  compiledWith: "test",
};

let root: string;

// One consumer directory for the file: every test below reads the config the first one wrote,
// and the order they run in is the order a person would run them.
beforeAll(async () => {
  root = await linkedConsumer();
});

describe("the config init writes", () => {
  test("is written by init in an empty consumer directory", async () => {
    const outcome = await runCli(["init", "v1-aaaaaaaa000aaa"], root);
    expect(outcome.lines.at(-2)).toBe("wrote nubbin.config.ts");
    expect(outcome.code).toBe(0);
  });

  test("typechecks under the repository's base compiler options", async () => {
    const result = await run(process.execPath, [TSC, "-p", join(root, "tsconfig.json")]).then(
      ({ stdout }) => ({ stdout, code: 0 }),
      (error: { stdout?: string; code?: number }) => ({
        stdout: error.stdout ?? "",
        code: error.code ?? -1,
      }),
    );
    expect(result.stdout).toBe("");
    expect(result.code).toBe(0);
  }, 90_000);

  test("passes check, loaded by the config loader a consumer's run goes through", async () => {
    const outcome = await runCli(["check"], root);
    expect(outcome.code).toBe(0);
    expect(outcome.lines[0]).toMatch(/^0 live route pointer\(s\) checked; every one is compatible/);
  });

  test("keeps drafts beside itself, one JSON file per route, absent until saved", async () => {
    const config = await loadConfig(join(root, "nubbin.config.ts"));
    expect(await config.document("/pricing")).toBeNull();
    const version = fixtureDocument("pricing", {});
    await config.save?.("/pricing", version);
    expect(existsSync(join(root, ".nubbin-drafts", "%2Fpricing.json"))).toBe(true);
    expect(await config.document("/pricing")).toEqual(version);
  });

  test("resolves one store, beside the config, from a subdirectory too", async () => {
    const store = createFsArtifactStore(join(root, ".nubbin"));
    await store.write(SEEDED);
    await store.publish(SEEDED.route, SEEDED.hash);
    const sub = join(root, "app", "pages");
    await mkdir(sub, { recursive: true });
    const outcome = await runCli(["status"], sub);
    expect(outcome.code).toBe(0);
    expect(outcome.lines[0]).toMatch(/^\/pricing -> f00dfeedf00dfeed \(moved /);
    expect(existsSync(join(sub, ".nubbin"))).toBe(false);
    expect(existsSync(join(root, "app", ".nubbin"))).toBe(false);
  });
});
