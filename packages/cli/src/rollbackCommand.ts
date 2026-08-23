import { checkRollback } from "@nubbin/core";
import type { Command } from "./command.types";
import { ExitCode } from "./exitCode.constants";
import { movePointer } from "./movePointer";
import { outcomeOf } from "./outcomeOf";
import { requiredArgument } from "./requiredArgument";
import { routeArgument } from "./routeArgument";
import { UsageError } from "./UsageError";

/**
 * Point a route back at an artifact already stored — after asking whether the blocks it was
 * compiled against are still the blocks in the registry now. A drifted block is a page that
 * renders wrongly or not at all, so the refusal moves nothing; and an artifact compiled for a
 * different route is never what was meant, however plausible its hash looks.
 */
export const rollbackCommand: Command = async (config, args) => {
  const route = routeArgument(args);
  const hash = requiredArgument(args, 1, "hash");
  const artifact = await config.store.read(hash);
  if (artifact === null) throw new UsageError(`no artifact stored as ${hash}`);
  if (artifact.route !== route) {
    throw new UsageError(`${hash} was compiled for ${artifact.route}, not ${route}`);
  }
  const verdict = checkRollback(artifact, config.registry);
  if (!verdict.compatible) {
    return {
      lines: [
        `refused: ${route} cannot roll back to ${hash}`,
        ...verdict.drifted.map((name) => `${name} is no longer the version it was compiled with`),
      ],
      code: ExitCode.Refused,
    };
  }
  await movePointer(config, args, route, hash);
  return outcomeOf(`rolled back ${route} -> ${hash}`, []);
};
