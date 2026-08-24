import type { Command } from "./command.types";
import { documentAt } from "./documentAt";
import { documentOutline } from "./documentOutline";
import { ExitCode } from "./exitCode.constants";

/**
 * The document as it is authored, not as it compiles. It deliberately does not compile: a person
 * reaching for this is usually holding something broken, and refusing to show them the ids would
 * withhold exactly what they need to fix it.
 */
export const showCommand: Command = async (config, args) => {
  const { route, version } = await documentAt(config, args);
  return {
    lines: [`${route}  ${version.documentId} v${version.version}`, ...documentOutline(version)],
    code: ExitCode.Done,
  };
};
