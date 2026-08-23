import type { Command } from "./command.types";
import { ExitCode } from "./exitCode.constants";
import { formatPointer } from "./formatPointer";

/**
 * What is live, read from the pointers and nothing else — no document is loaded and nothing is
 * compiled, so the answer is about the store, not about what would publish today. Sorted by
 * route because the manifest reads the store in whatever order it likes, and a listing that
 * shuffles between runs cannot be diffed. An empty answer is printed rather than implied — a
 * command that says nothing reads as a crash — and it exits Done either way, because asking
 * what is live is not a failure when the answer is "nothing".
 */
export const statusCommand: Command = async (config, args) => {
  const route = args.positionals[0];
  const manifest = await config.store.manifest();
  const pointers = manifest.routes
    .filter((pointer) => route === undefined || pointer.route === route)
    .sort((a, b) => a.route.localeCompare(b.route));
  const lines =
    pointers.length === 0
      ? [route === undefined ? "nothing is live" : `nothing is live at ${route}`]
      : pointers.map(formatPointer);
  return { lines, code: ExitCode.Done };
};
