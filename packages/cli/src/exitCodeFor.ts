import { ExitCode } from "./exitCode.constants";
import { UsageError } from "./UsageError";

/**
 * A usage error means nothing was attempted; anything else got as far as being refused. The two
 * are worth separating because a person fixes them in different places — the command line, or
 * the document.
 */
export const exitCodeFor = (error: unknown): number =>
  error instanceof UsageError ? ExitCode.Usage : ExitCode.Refused;
