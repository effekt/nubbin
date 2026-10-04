/**
 * The `nubbin.config.ts` that `init` writes for a plan whose drafts, publishing and artifacts are
 * all the customer's. One file, importing only `@nubbin/core`, `@nubbin/cli` and
 * `@nubbin/store-fs` from Nubbin: the catalog and registry start empty for the blocks to be
 * registered into, the store is the reference adapter over `.nubbin`, and drafts are one JSON
 * file per route under `.nubbin-drafts`.
 *
 * Both directories resolve against the config file's own directory rather than the working
 * directory. `findConfigFile` climbs, so a run from a subdirectory finds this file — and a path
 * relative to `process.cwd()` would then read and write a second store in that subdirectory.
 *
 * `initConfigSource.constants.test.ts` typechecks this text under the repository's base compiler
 * options and runs `check` against it, so an edit that stops it compiling fails there rather than
 * in a consumer's terminal.
 */
export const INIT_CONFIG_SOURCE = `import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineConfig } from "@nubbin/cli";
import { createRegistry, defineCatalog, type DocumentVersion } from "@nubbin/core";
import { createFsArtifactStore } from "@nubbin/store-fs";

// Paths resolve against this file rather than the working directory: the command line finds
// this config by climbing from wherever it was run, and a run from a subdirectory would
// otherwise read and write a second store there.
const here = import.meta.dirname;

// One JSON file per route, with the route encoded so its slashes cannot become directories.
const draftPath = (route: string): string =>
  join(here, ".nubbin-drafts", \`\${encodeURIComponent(route)}.json\`);

export default defineConfig({
  // Register your blocks here. The catalog carries each block's schema and editing hints; the
  // registry carries the definitions a document is compiled against.
  catalog: defineCatalog({}),
  registry: createRegistry([]),
  store: createFsArtifactStore(join(here, ".nubbin")),
  // An absent draft is "no document". A draft that is present but unreadable throws, because
  // answering "no document" over a corrupt file would silently discard the edits in it.
  document: (route) => {
    const path = draftPath(route);
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf8")) as DocumentVersion;
  },
  save: (route, version) => {
    const path = draftPath(route);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, \`\${JSON.stringify(version)}\\n\`);
  },
});
`;
