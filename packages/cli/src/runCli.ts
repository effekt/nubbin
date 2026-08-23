import type { CommandOutcome } from "./command.types";
import { COMMANDS } from "./commands.constants";
import { exitCodeFor } from "./exitCodeFor";
import { formatRefusal } from "./formatRefusal";
import { parseCliArgs } from "./parseCliArgs";
import { resolveConfig } from "./resolveConfig";
import { usageOutcome } from "./usageOutcome";

/**
 * The whole run, as a value. It returns what to print and what to exit with rather than doing
 * either, which is what makes the command line testable without a subprocess — and leaves one
 * place, the bin, that writes to a stream.
 *
 * The config is resolved after the command is recognised, so a typo is answered by the usage
 * text rather than by a complaint about a missing config file.
 */
export async function runCli(argv: readonly string[], cwd: string): Promise<CommandOutcome> {
  try {
    const { command, configPath, args } = parseCliArgs(argv);
    const run = command === undefined ? undefined : COMMANDS[command];
    if (run === undefined) return usageOutcome(command);
    return await run(await resolveConfig(cwd, configPath), args);
  } catch (error) {
    return { lines: formatRefusal(error), code: exitCodeFor(error) };
  }
}
