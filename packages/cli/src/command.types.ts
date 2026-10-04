import type { NubbinConfig } from "./config.types";

/** What the bin passes on: everything after the command name, plus the flags it recognises. */
export interface CommandArgs {
  positionals: readonly string[];
  /** A running application to publish through, instead of moving the pointer from here. */
  origin?: string;
  /** A document version to resolve through the route's history, instead of naming a hash. */
  to?: string;
  /** The node whose slot receives what `add` and `move` place. */
  parent?: string;
  /** Which slot on that parent. */
  slot?: string;
  /** Where in the slot; absent means the end. */
  index?: number;
}

/**
 * What a command hands back rather than prints. Returning lines keeps every command testable
 * against what a person will actually read, and leaves one place — the bin — writing to a
 * stream. The lines are the outcome itself: the answer when the command happened, the causes
 * when it did not, and the code says which.
 */
export interface CommandOutcome {
  lines: readonly string[];
  /**
   * Noticed without stopping the command, and kept out of the lines because scripts capture
   * stdout: a warning mixed into `$(nubbin compile …)` would be captured as part of the answer.
   */
  warnings?: readonly string[];
  code: number;
}

export type Command = (config: NubbinConfig, args: CommandArgs) => Promise<CommandOutcome>;

/**
 * A command that runs before any config exists — `init`, which writes one — so it is handed the
 * working directory in the config's place.
 */
export type ConfiglessCommand = (cwd: string, args: CommandArgs) => Promise<CommandOutcome>;

/** What every entry says about the arguments it reads, whichever kind of command it runs. */
interface CommandReads {
  takes: number;
  /** Whether `--origin` means anything here — only a command that moves a pointer can use one. */
  moves?: boolean;
  /** Whether `--to` means anything here — only a command that resolves through history reads one. */
  resolves?: boolean;
  /** Whether `--parent`, `--slot` and `--index` mean anything here — only a command that places a node in a slot reads them. */
  places?: boolean;
}

/** The ordinary entry: the bin resolves a config, then runs the command against it. */
interface ConfiguredCommandEntry extends CommandReads {
  run: Command;
  configless?: false;
}

/** An entry the bin runs with no config resolved, and refuses `--config` for. */
interface ConfiglessCommandEntry extends CommandReads {
  run: ConfiglessCommand;
  configless: true;
}

/** One command as the bin holds it: what to run, what it reads, and whether it needs a config. */
export type CommandEntry = ConfiguredCommandEntry | ConfiglessCommandEntry;
