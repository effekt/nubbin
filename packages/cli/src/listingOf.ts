import type { CommandOutcome } from "./command.types";
import { ExitCode } from "./exitCode.constants";

/**
 * A command that answers "what is there" and found nothing. The empty answer is a line rather
 * than no output, because a command that prints nothing reads as one that crashed — and it
 * succeeds, because asking what is there is not a failure when the answer is "nothing".
 */
export const listingOf = (lines: readonly string[], whenEmpty: string): CommandOutcome => ({
  lines: lines.length === 0 ? [whenEmpty] : lines,
  code: ExitCode.Done,
});
