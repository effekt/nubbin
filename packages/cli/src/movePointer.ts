import type { CommandArgs } from "./command.types";
import type { NubbinConfig } from "./config.types";
import { publishThroughOrigin } from "./publishThroughOrigin";

/**
 * Points a route at a hash — from here, or through the running application when `--origin`
 * names one. Publishing and rolling back both end in exactly this move, and sharing it keeps
 * the cache reasoning behind `publishThroughOrigin` from being applied to one command and
 * forgotten in the other.
 */
export async function movePointer(
  config: NubbinConfig,
  args: CommandArgs,
  route: string,
  to: string,
): Promise<void> {
  if (args.origin === undefined) await config.store.publish(route, to);
  else await publishThroughOrigin(args.origin, "publish", { route, hash: to });
}
