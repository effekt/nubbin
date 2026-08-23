import { NubbinError } from "@nubbin/core";
import { formatIssue } from "./formatIssue";

/**
 * One line per cause. `compile` collects, so an author fixing six problems is shown six rather
 * than the first — and each line leads with the code, which is what a script branches on.
 *
 * Anything else is printed as it came: a store that could not write, a network that refused. The
 * CLI has no better account of those than the error itself.
 */
export function formatRefusal(error: unknown): readonly string[] {
  if (error instanceof NubbinError) return error.issues.map(formatIssue);
  return [error instanceof Error ? error.message : String(error)];
}
