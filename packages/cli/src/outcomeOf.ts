import type { NubbinIssue } from "@nubbin/core";
import type { CommandOutcome } from "./command.types";
import { ExitCode } from "./exitCode.constants";
import { formatIssue } from "./formatIssue";

/**
 * What a command that worked hands back: what it did, then anything it has to say about the
 * document that did not stop it doing so. Issues here are never a failure — `compile` throws
 * when no artifact exists, so an issue that reached this point came with one.
 */
export const outcomeOf = (headline: string, issues: readonly NubbinIssue[]): CommandOutcome => ({
  lines: [headline, ...issues.map(formatIssue)],
  code: ExitCode.Done,
});
