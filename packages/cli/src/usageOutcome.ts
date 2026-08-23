import type { CommandOutcome } from "./command.types";
import { ExitCode } from "./exitCode.constants";
import { USAGE } from "./usage.constants";

/**
 * Asking for the usage text succeeds; failing to name a command does not. The distinction is
 * what lets a script tell a person reading the help from a pipeline that ran `nubbin` with an
 * empty variable where the command should have been.
 */
export function usageOutcome(command?: string): CommandOutcome {
  if (command === "help") return { lines: [USAGE], code: ExitCode.Done };
  const named = command === undefined ? [] : [`no command named ${command}`];
  return { lines: [...named, USAGE], code: ExitCode.Usage };
}
