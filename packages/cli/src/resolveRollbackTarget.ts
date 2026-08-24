import type { CommandArgs } from "./command.types";
import type { NubbinConfig } from "./config.types";
import { requiredArgument } from "./requiredArgument";
import { routeHistory } from "./routeHistory";
import { UsageError } from "./UsageError";

/**
 * Which artifact a rollback means: a hash names it directly, and `--to` names the document
 * version whose publish it was, resolved through the store's history. The latest move of that
 * version wins — a version published twice was last live as its later move. Given both, the
 * command refuses rather than guessing which one was meant.
 */
export async function resolveRollbackTarget(
  config: NubbinConfig,
  args: CommandArgs,
  route: string,
): Promise<string> {
  const named = args.positionals[1];
  if (args.to === undefined) return requiredArgument(args, 1, "hash");
  if (named !== undefined) {
    throw new UsageError(`--to resolves a hash through history, so ${named} would be ignored`);
  }
  if (!/^[1-9]\d*$/.test(args.to)) {
    throw new UsageError(`--to takes a document version, and ${args.to} is not one`);
  }
  const moves = await routeHistory(config, route, "--to cannot be resolved; name the hash instead");
  const version = Number(args.to);
  const move = [...moves].reverse().find((entry) => entry.documentVersion === version);
  if (move === undefined) {
    throw new UsageError(`no publish of ${route} at document version ${version} is recorded`);
  }
  return move.hash;
}
