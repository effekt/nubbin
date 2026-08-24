import type { DocumentVersion } from "@nubbin/core";
import type { CommandArgs } from "./command.types";
import type { NubbinConfig } from "./config.types";
import { loadDocument } from "./loadDocument";
import { routeArgument } from "./routeArgument";

/**
 * The route positional and the document behind it — where a command that reads or edits a
 * document begins, the way `compiledRoute` is where one that needs an artifact begins and
 * `livePointer` is where one that acts on what is live begins.
 *
 * It exists because every command opens with the same two lines, and two lines repeated across
 * commands is one unit that had not been named yet.
 */
export async function documentAt(
  config: NubbinConfig,
  args: CommandArgs,
): Promise<{ route: string; version: DocumentVersion }> {
  const route = routeArgument(args);
  return { route, version: await loadDocument(config, route) };
}
