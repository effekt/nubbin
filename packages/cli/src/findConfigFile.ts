import { dirname, join } from "node:path";
import { existingConfigIn } from "./existingConfigIn";
import { repositoryRootAbove } from "./repositoryRootAbove";

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
    const found = await existingConfigIn(dir);
    if (found !== null) return join(dir, found);
    if (dir === ceiling || dirname(dir) === dir) return null;
  }
}
