import { dirname, join } from "node:path";
import { pathExists } from "./pathExists";

/**
 * The nearest directory at or above `from` carrying a `.git` entry — a directory in an ordinary
 * checkout, a file in a linked worktree, and either marks where the repository is. `null` says
 * no repository surrounds `from` at all, which callers treat as a boundary of its own rather
 * than as licence to keep climbing.
 */
export async function repositoryRootAbove(from: string): Promise<string | null> {
  for (let dir = from; ; dir = dirname(dir)) {
    if (await pathExists(join(dir, ".git"))) return dir;
    if (dirname(dir) === dir) return null;
  }
}
