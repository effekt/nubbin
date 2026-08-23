import { checkCommand } from "./checkCommand";
import type { Command } from "./command.types";
import { compileCommand } from "./compileCommand";
import { publishCommand } from "./publishCommand";
import { statusCommand } from "./statusCommand";

/** Every command by the word that runs it. A record rather than a switch, so the bin branches once. */
export const COMMANDS: Record<string, Command> = {
  check: checkCommand,
  compile: compileCommand,
  publish: publishCommand,
  status: statusCommand,
};
