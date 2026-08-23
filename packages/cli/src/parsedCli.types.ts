import type { CommandArgs } from "./command.types";

/** The command line, split into the part that finds the config and the part a command reads. */
export interface ParsedCli {
  command?: string;
  configPath?: string;
  args: CommandArgs;
}
