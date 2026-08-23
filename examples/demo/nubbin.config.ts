import { fixtureRoutes } from "./fixtures/fixtureRoutes";
import { stampedVersion } from "./scripts/stampedVersion";
import { catalog } from "./src/nubbin/catalog";
import { demoStore } from "./src/nubbin/demoStore";
import { registry } from "./src/nubbin/registry";

/**
 * The demo as a consumer of `@nubbin/cli`: `nubbin publish /pricing` from this directory finds
 * this file, and publishes the same fixture the scripts beside it do.
 *
 * `registry` is the compile-side one — schemas and versions. `blockRegistry`, which the render
 * path uses, has no schemas and would fail here rather than quietly compile something weaker.
 *
 * `STAMP` is honoured for the reason `publishLive.ts` takes one: republishing an unchanged
 * document is content-addressed to the same hash, so the pointer would not move and no
 * assertion could tell an invalidated page from an untouched one.
 */
export default {
  catalog,
  registry,
  store: demoStore,
  document: (route: string) => {
    const version = fixtureRoutes[route];
    return version === undefined ? null : stampedVersion(version, process.env.STAMP);
  },
};
