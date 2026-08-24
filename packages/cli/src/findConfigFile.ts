import { dirname, join } from "node:path";
import { pathExists } from "./pathExists";
import { repositoryRootAbove } from "./repositoryRootAbove";

/**
 * TypeScript first: where both are present the `.js` is compiled output beside its own source,
 * and loading it would run a copy of the config that is one build behind.
 */
const CONFIG_FILENAMES = ["nubbin.config.ts", "nubbin.config.js"];

/**
 * The config lives beside the application it configures, so the search starts where the command
 * was run and climbs — an application's own config wins over the repository's.
 *
 * The climb ends at the repository root, found by its `.git` entry. A config above the
 * repository belongs to some other project, and picking it up would publish one application's
 * routes with another's registry. Where no `.git` exists at all — a tarball, a vendored copy, a
 * Docker build context — there is no boundary to trust, so only the starting directory is
 * searched and `--config` names anything further away.
 */
export async function findConfigFile(from: string): Promise<string | null> {
  const ceiling = (await repositoryRootAbove(from)) ?? from;
  for (let dir = from; ; dir = dirname(dir)) {
    for (const filename of CONFIG_FILENAMES) {
      const candidate = join(dir, filename);
      if (await pathExists(candidate)) return candidate;
    }
    if (dir === ceiling || dirname(dir) === dir) return null;
  }
}
