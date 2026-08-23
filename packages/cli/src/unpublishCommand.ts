import type { Command } from "./command.types";
import { livePointer } from "./livePointer";
import { outcomeOf } from "./outcomeOf";
import { publishThroughOrigin } from "./publishThroughOrigin";

/**
 * Drop the pointer, and only the pointer — the artifact stays in the store, which is what makes
 * a later rollback possible.
 */
export const unpublishCommand: Command = async (config, args) => {
  const { route } = await livePointer(config, args);
  if (args.origin === undefined) await config.store.unpublish(route);
  else await publishThroughOrigin(args.origin, "unpublish", { route });
  return outcomeOf(`unpublished ${route}`, []);
};
