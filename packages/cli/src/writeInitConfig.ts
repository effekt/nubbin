import type { CommandOutcome } from "./command.types";
import { existingConfigIn } from "./existingConfigIn";
import { existingConfigOutcome } from "./existingConfigOutcome";
import { ExitCode } from "./exitCode.constants";
import { hostedPublishField } from "./hostedPublishField";
import type { Plan } from "./plan/plan.types";
import { writeNewConfig } from "./writeNewConfig";
import { WROTE_NOTHING } from "./wroteNothing.constants";

/**
 * The outcome line of `init`, and the write behind it when there is one. A stage Nubbin runs is
 * answered first and succeeds, since nothing could be written for it either way; a config already
 * in the working directory is answered next and refuses, since the file a person has is worth
 * more than the one this would write. Only then is the file written. The check here is what
 * notices a `nubbin.config.js`, which the write's own `wx` would not; the write notices a `.ts`
 * that appeared after this looked.
 */
export async function writeInitConfig(cwd: string, plan: Plan): Promise<CommandOutcome> {
  const hosted = hostedPublishField(plan);
  if (hosted !== null) return { lines: [WROTE_NOTHING[hosted]], code: ExitCode.Done };
  const existing = await existingConfigIn(cwd);
  if (existing !== null) return existingConfigOutcome(existing);
  return writeNewConfig(cwd);
}
