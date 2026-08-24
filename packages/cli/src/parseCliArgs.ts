import { parseArgs } from "node:util";
import type { ParsedCli } from "./parsedCli.types";
import { UsageError } from "./UsageError";

const OPTIONS = {
  config: { type: "string" },
  origin: { type: "string" },
  to: { type: "string" },
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
    // Spread rather than assigned: with exactOptionalPropertyTypes an absent flag has to be an
    // absent property, not a property holding undefined.
    return {
      ...(command === undefined ? {} : { command }),
      ...(values.config === undefined ? {} : { configPath: values.config }),
      args: {
        positionals: rest,
        ...(values.origin === undefined ? {} : { origin: values.origin }),
        ...(values.to === undefined ? {} : { to: values.to }),
      },
    };
  } catch (error) {
    throw new UsageError(error instanceof Error ? error.message : String(error));
  }
}
