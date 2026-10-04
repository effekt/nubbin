import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { CommandOutcome } from "./command.types";
import { TYPESCRIPT_CONFIG_FILENAME } from "./configFilenames.constants";
import { existingConfigIn } from "./existingConfigIn";
import { ExitCode } from "./exitCode.constants";
import { hostedPublishField } from "./hostedPublishField";
import { INIT_CONFIG_SOURCE } from "./initConfigSource.constants";
import type { Plan } from "./plan/plan.types";
import { WROTE_NOTHING } from "./wroteNothing.constants";

/**
 * The outcome line of `init`, and the write behind it when there is one. A stage Nubbin runs is
 * answered first and succeeds, since nothing could be written for it either way; a config already
 * in the working directory is answered next and refuses, since the file a person has is worth
 * more than the one this would write. Only then is the file written — with `wx`, so a config
 * that appeared between the check and the write fails the write rather than being overwritten.
 */
export async function writeInitConfig(cwd: string, plan: Plan): Promise<CommandOutcome> {
  const hosted = hostedPublishField(plan);
  if (hosted !== null) return { lines: [WROTE_NOTHING[hosted]], code: ExitCode.Done };
  const existing = await existingConfigIn(cwd);
  if (existing !== null) {
    return { lines: [`wrote nothing: ${existing} already exists`], code: ExitCode.Refused };
  }
  await writeFile(join(cwd, TYPESCRIPT_CONFIG_FILENAME), INIT_CONFIG_SOURCE, { flag: "wx" });
  return { lines: [`wrote ${TYPESCRIPT_CONFIG_FILENAME}`], code: ExitCode.Done };
}
