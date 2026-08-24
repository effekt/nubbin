import { resolve } from "node:path";
import type { NubbinConfig } from "./config.types";
import { findConfigFile } from "./findConfigFile";
import { loadConfig } from "./loadConfig";
import { pathExists } from "./pathExists";
import { repositoryRootAbove } from "./repositoryRootAbove";
import { UsageError } from "./UsageError";

/**
 * A named path is taken as given and never searched around: someone who passed `--config` and
 * mistyped it should hear about their path, not silently publish through whichever config the
 * search happened to climb into next.
 *
 * The two not-found messages differ because the searches did: inside a repository the climb
 * reached its root and found nothing, and outside one it never left the working directory.
 */
export async function resolveConfig(cwd: string, configPath?: string): Promise<NubbinConfig> {
  if (configPath !== undefined) {
    const named = resolve(cwd, configPath);
    if (!(await pathExists(named))) throw new UsageError(`no config at ${configPath}`);
    return loadConfig(named);
  }
  const found = await findConfigFile(cwd);
  if (found !== null) return loadConfig(found);
  throw new UsageError(
    (await repositoryRootAbove(cwd)) === null
      ? `no nubbin.config.ts in ${cwd}, and no repository around it to climb — name one with --config`
      : `no nubbin.config.ts found in ${cwd} or above it`,
  );
}
