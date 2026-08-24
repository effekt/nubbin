import type { Command } from "./command.types";
import { formatMove } from "./formatMove";
import { listingOf } from "./listingOf";
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
  return listingOf(moves.map(formatMove).reverse(), `no publish of ${route} is recorded`);
};
