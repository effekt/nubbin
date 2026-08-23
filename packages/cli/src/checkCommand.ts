import { checkCompatibility, formatCompatibilityReport, type LiveRoute } from "@nubbin/core";
import type { Command } from "./command.types";
import { ExitCode } from "./exitCode.constants";

/**
 * The CI gate: every pointer against the registry as the code has it now, exiting Refused when
 * a live page depends on a block that changed version or left. It only reads — compiling here
 * would judge what a route would publish as, and the question is what is already published. A
 * hash the store cannot resolve is handed to core as the `null` it read, because a pointer into
 * nothing is exactly the breakage this command exists to catch.
 */
export const checkCommand: Command = async (config) => {
  const manifest = await config.store.manifest();
  const live: LiveRoute[] = await Promise.all(
    manifest.routes.map(async (pointer) => ({
      pointer,
      artifact: await config.store.read(pointer.hash),
    })),
  );
  const report = checkCompatibility(live, config.registry);
  return {
    lines: formatCompatibilityReport(report).split("\n"),
    code: report.compatible ? ExitCode.Done : ExitCode.Refused,
  };
};
