import type { Command } from "./command.types";
import { compiledRoute } from "./compiledRoute";
import { movePointer } from "./movePointer";
import { outcomeOf } from "./outcomeOf";

/**
 * Write the artifact, then move the pointer — in that order, because a pointer at a hash nothing
 * has written is a live 404, while an artifact nothing points at is merely invisible.
 */
export const publishCommand: Command = async (config, args) => {
  const { route, artifact, issues } = await compiledRoute(config, args);
  await config.store.write(artifact);
  await movePointer(config, args, route, artifact.hash);
  return outcomeOf(`published ${route} -> ${artifact.hash}`, issues);
};
