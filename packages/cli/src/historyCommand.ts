import type { Command } from "./command.types";
import { ExitCode } from "./exitCode.constants";
import { formatMove } from "./formatMove";
import { routeArgument } from "./routeArgument";
import { routeHistory } from "./routeHistory";

/**
 * What the route has pointed at, newest first — a person reads this to roll back, and the
 * candidate is almost always the previous move, so it belongs at the top. An empty trail is
 * an answer, not a failure.
 */
export const historyCommand: Command = async (config, args) => {
  const route = routeArgument(args);
  const moves = await routeHistory(config, route, "there is no history to list");
  const lines =
    moves.length === 0 ? [`no publish of ${route} is recorded`] : moves.map(formatMove).reverse();
  return { lines, code: ExitCode.Done };
};
