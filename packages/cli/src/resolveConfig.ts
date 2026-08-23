import { resolve } from "node:path";
import type { NubbinConfig } from "./config.types";
import { findConfigFile } from "./findConfigFile";
import { loadConfig } from "./loadConfig";
import { pathExists } from "./pathExists";
import { UsageError } from "./UsageError";

/**
 * A named path is taken as given and never searched around: someone who passed `--config` and
 * mistyped it should hear about their path, not silently publish through whichever config the
 * search happened to climb into next.
 */
export async function resolveConfig(cwd: string, configPath?: string): Promise<NubbinConfig> {
  if (configPath !== undefined) {
    const named = resolve(cwd, configPath);
    if (!(await pathExists(named))) throw new UsageError(`no config at ${configPath}`);
    return loadConfig(named);
  }
  const found = await findConfigFile(cwd);
  if (found === null) {
    throw new UsageError(`no nubbin.config.ts found in ${cwd} or above it`);
  }
  return loadConfig(found);
}
