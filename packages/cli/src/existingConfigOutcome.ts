import type { CommandOutcome } from "./command.types";
import { ExitCode } from "./exitCode.constants";

/**
 * The outcome of `init` finding a config already where it would write one: the file is named,
 * nothing is written, and the run is refused. One place for the line because two paths reach it
 * — the check before the write, and the write itself when a file appeared in between.
 */
export function existingConfigOutcome(filename: string): CommandOutcome {
  return { lines: [`wrote nothing: ${filename} already exists`], code: ExitCode.Refused };
}
