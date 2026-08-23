import { parseArgs } from "node:util";
import type { ParsedCli } from "./parsedCli.types";
import { UsageError } from "./UsageError";

const OPTIONS = {
  config: { type: "string" },
  origin: { type: "string" },
} as const;

/**
 * `node:util` rather than a parser dependency: six commands and two flags is what `parseArgs`
 * is for, and a CLI that publishes a consumer's site is a poor place to add supply chain.
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
      command,
      configPath: values.config,
      args: { positionals: rest, origin: values.origin },
    };
  } catch (error) {
    throw new UsageError(error instanceof Error ? error.message : String(error));
  }
}
