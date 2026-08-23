import type { RoutePointer } from "@nubbin/core";
import type { CommandArgs } from "./command.types";
import type { NubbinConfig } from "./config.types";
import { routeArgument } from "./routeArgument";
import { UsageError } from "./UsageError";

/**
 * The route positional and the pointer live behind it — where a command that acts on what is
 * live begins, the way `compiledRoute` is where a command that starts from a document does.
 * Resolved before anything is touched, so a mistyped route fails loudly rather than succeeding
 * over nothing.
 */
export async function livePointer(config: NubbinConfig, args: CommandArgs): Promise<RoutePointer> {
  const route = routeArgument(args);
  const pointer = await config.store.pointer(route);
  if (pointer === null) throw new UsageError(`nothing is live at ${route}`);
  return pointer;
}
