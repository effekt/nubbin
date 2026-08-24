import { defineConfig } from "@nubbin/cli";
import { fixtureRoutes } from "./fixtures/fixtureRoutes";
import { catalog } from "./src/nubbin/catalog";
import { liveStore } from "./src/nubbin/liveStore";
import { registry } from "./src/nubbin/registry";

/**
 * The same site, pointed at the committed store that stands in for what is already published.
 * Re-recording it is the deliberate path out of a guardrail failure: the result is a diff a
 * reviewer reads, in the same pull request that moved a block's version.
 *
 * A second config rather than a flag on the first, because which store a command writes to is
 * the consumer's decision and `--config` is how the CLI takes it.
 */
export default defineConfig({
  catalog,
  registry,
  store: liveStore,
  document: (route: string) => fixtureRoutes[route] ?? null,
});
