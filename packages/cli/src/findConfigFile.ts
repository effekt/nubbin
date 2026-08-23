import { dirname, join } from "node:path";
import { pathExists } from "./pathExists";

/**
 * TypeScript first: where both are present the `.js` is compiled output beside its own source,
 * and loading it would run a copy of the config that is one build behind.
 */
const CONFIG_FILENAMES = ["nubbin.config.ts", "nubbin.config.js"];

/**
 * The config lives beside the application it configures, so the search starts where the command
 * was run and climbs — an application's own config wins over the repository's.
 *
 * It stops at the repository root rather than at the filesystem's. A config above the repository
 * belongs to some other project, and picking it up would publish one application's routes with
 * another's registry.
 */
export async function findConfigFile(from: string): Promise<string | null> {
  for (const filename of CONFIG_FILENAMES) {
    const candidate = join(from, filename);
    if (await pathExists(candidate)) return candidate;
  }
  const parent = dirname(from);
  if (parent === from || (await pathExists(join(from, ".git")))) return null;
  return findConfigFile(parent);
}
