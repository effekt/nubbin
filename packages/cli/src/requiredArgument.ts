import type { CommandArgs } from "./command.types";
import { UsageError } from "./UsageError";

/** Reads a positional the command cannot run without, and says which one is missing when it is. */
export function requiredArgument(args: CommandArgs, index: number, name: string): string {
  const value = args.positionals[index];
  if (value === undefined) throw new UsageError(`this command needs a ${name}`);
  return value;
}
