import { defineConfig } from "@nubbin/cli";
import { fixtureRoutes } from "./fixtures/fixtureRoutes";
import { stampedVersion } from "./scripts/stampedVersion";
import { catalog } from "./src/nubbin/catalog";
import { demoStore } from "./src/nubbin/demoStore";
import { readDraft } from "./src/nubbin/readDraft";
import { registry } from "./src/nubbin/registry";
import { writeDraft } from "./src/nubbin/writeDraft";

/**
 * The demo as a consumer of `@nubbin/cli`: `nubbin publish /dispatches` from this directory finds
 * this file, and publishes the same fixture the scripts beside it do.
 *
 * The write verbs land in a draft — one file per route, beside the store — and `document`
 * prefers a draft when one exists. That is the loop a person actually runs: edit, then publish,
 * with the fixture as the starting point rather than the answer.
 *
 * `registry` is the compile-side one — schemas and versions. `blockRegistry`, which the render
 * path uses, has no schemas and would fail here rather than quietly compile something weaker.
 *
 * `STAMP` is honoured because a republish has to be observable: republishing an unchanged
 * document is content-addressed to the same hash, so the pointer would not move and no
 * assertion could tell an invalidated page from an untouched one.
 */
export default defineConfig({
  catalog,
  registry,
  store: demoStore,
  document: (route: string) => {
    const version = readDraft(route) ?? fixtureRoutes[route];
    return version === undefined ? null : stampedVersion(version, process.env.STAMP);
  },
  save: writeDraft,
});
