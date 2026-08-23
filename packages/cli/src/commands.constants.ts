import type { Command } from "./command.types";
import { compileCommand } from "./compileCommand";
import { publishCommand } from "./publishCommand";

/** Every command by the word that runs it. A record rather than a switch, so the bin branches once. */
export const COMMANDS: Record<string, Command> = {
  compile: compileCommand,
  publish: publishCommand,
};
