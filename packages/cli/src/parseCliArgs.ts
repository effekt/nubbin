import { parseArgs } from "node:util";
import type { ParsedCli } from "./parsedCli.types";
import { parseIndexFlag } from "./parseIndexFlag";
import { UsageError } from "./UsageError";
import { withoutAbsent } from "./withoutAbsent";

const OPTIONS = {
  config: { type: "string" },
  origin: { type: "string" },
  to: { type: "string" },
  parent: { type: "string" },
  slot: { type: "string" },
  index: { type: "string" },
} as const;

/**
 * `node:util` rather than a parser dependency: a dozen commands and six flags is what
 * `parseArgs` is for, and a CLI that publishes a consumer's site is a poor place to add supply
 * chain.
 *
 * Strict, so an unrecognised flag stops the run. A misspelled `--origin` would otherwise publish
 * into the store while the author believed they were publishing through their server.
 */
export function parseCliArgs(argv: readonly string[]): ParsedCli {
  try {
    const { values, positionals } = parseArgs({
      args: [...argv],
      options: OPTIONS,
      allowPositionals: true,
    });
    const [command, ...rest] = positionals;
    return {
      ...withoutAbsent({ command, configPath: values.config }),
      args: {
        positionals: rest,
        ...withoutAbsent({
          origin: values.origin,
          to: values.to,
          parent: values.parent,
          slot: values.slot,
          index: values.index === undefined ? undefined : parseIndexFlag(values.index),
        }),
      },
    };
  } catch (error) {
    throw new UsageError(error instanceof Error ? error.message : String(error));
  }
}
