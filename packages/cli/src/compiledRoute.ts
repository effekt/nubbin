import { type CompileResult, compile } from "@nubbin/core";
import type { CommandArgs } from "./command.types";
import type { NubbinConfig } from "./config.types";
import { documentAt } from "./documentAt";

/**
 * The route, its document, and the compile — where every command that touches a route begins,
 * because legality is only knowable by compiling. Publishing runs this same path as the dry run,
 * so a `compile` that passed and a `publish` that refused cannot disagree about what was judged.
 */
export async function compiledRoute(
  config: NubbinConfig,
  args: CommandArgs,
): Promise<CompileResult & { route: string }> {
  const { route, version } = await documentAt(config, args);
  return { route, ...compile(version, config.catalog, config.registry, route) };
}
