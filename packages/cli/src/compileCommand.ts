import type { Command } from "./command.types";
import { compiledRoute } from "./compiledRoute";
import { outcomeOf } from "./outcomeOf";

/**
 * The dry run: it answers "would this publish, and as what" and writes nothing. Without it the
 * only way to ask the question is to publish, and the only way to take the answer back is to
 * publish again.
 */
export const compileCommand: Command = async (config, args) => {
  const { route, artifact, issues } = await compiledRoute(config, args);
  return outcomeOf(`${route} -> ${artifact.hash}`, issues);
};
