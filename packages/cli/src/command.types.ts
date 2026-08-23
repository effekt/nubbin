import type { NubbinConfig } from "./config.types";

/** What the bin passes on: everything after the command name, plus the flags it recognises. */
export interface CommandArgs {
  positionals: readonly string[];
  /** A running application to publish through, instead of moving the pointer from here. */
  origin?: string;
}

/**
 * What a command hands back rather than prints. Returning lines keeps every command testable
 * against what a person will actually read, and leaves one place — the bin — writing to stdout.
 */
export interface CommandOutcome {
  lines: readonly string[];
  code: number;
}

export type Command = (config: NubbinConfig, args: CommandArgs) => Promise<CommandOutcome>;
