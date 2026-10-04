import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { CommandOutcome } from "./command.types";
import { TYPESCRIPT_CONFIG_FILENAME } from "./configFilenames.constants";
import { existingConfigOutcome } from "./existingConfigOutcome";
import { ExitCode } from "./exitCode.constants";
import { hasErrorCode } from "./hasErrorCode";
import { INIT_CONFIG_SOURCE } from "./initConfigSource.constants";

/**
 * The write itself, with `wx` so a config that appeared since the caller looked is never
 * overwritten. That `EEXIST` is answered with the same line the caller's own check gives, rather
 * than with the raw error: the person reads one outcome whichever side of the check the file
 * arrived on, and the printout and the `Plan:` line around it stay where they are.
 */
export async function writeNewConfig(cwd: string): Promise<CommandOutcome> {
  try {
    await writeFile(join(cwd, TYPESCRIPT_CONFIG_FILENAME), INIT_CONFIG_SOURCE, { flag: "wx" });
  } catch (error) {
    if (!hasErrorCode(error, "EEXIST")) throw error;
    return existingConfigOutcome(TYPESCRIPT_CONFIG_FILENAME);
  }
  return { lines: [`wrote ${TYPESCRIPT_CONFIG_FILENAME}`], code: ExitCode.Done };
}
