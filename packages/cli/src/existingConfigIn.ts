import { join } from "node:path";
import { CONFIG_FILENAMES } from "./configFilenames.constants";
import { pathExists } from "./pathExists";

/**
 * The config filename present in one directory, or `null`. It looks in that directory alone:
 * `findConfigFile` climbs by asking this of each directory in turn, and `init` asks it of the
 * working directory only, because the file it would write goes there and nowhere above.
 */
export async function existingConfigIn(dir: string): Promise<string | null> {
  for (const filename of CONFIG_FILENAMES) {
    if (await pathExists(join(dir, filename))) return filename;
  }
  return null;
}
