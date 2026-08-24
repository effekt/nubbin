import { UsageError } from "./UsageError";

/** Reads a flag the command cannot run without, and says which one is missing when it is. */
export function requiredFlag(value: string | undefined, name: string): string {
  if (value === undefined) throw new UsageError(`this command needs --${name}`);
  return value;
}
