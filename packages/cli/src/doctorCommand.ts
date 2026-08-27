import { checkCompatibility, formatCompatibilityReport } from "@nubbin/core";
import type { Command } from "./command.types";
import { diagnoseCatalog } from "./diagnoseCatalog";
import { diagnoseManifest } from "./diagnoseManifest";
import { diagnosePointers } from "./diagnosePointers";
import { ExitCode } from "./exitCode.constants";
import { loadLiveRoutes } from "./loadLiveRoutes";

/**
 * Diagnoses the Nubbin-owned seams of a project without changing any of them. The consumer's
 * auth, network and storage topology remain outside this command: the store is judged only by
 * the values its public contract returns.
 */
export const doctorCommand: Command = async (config) => {
  const { manifest, live } = await loadLiveRoutes(config.store);
  const diagnoses = [
    diagnoseCatalog(config.catalog, config.registry),
    diagnoseManifest(manifest),
    diagnosePointers(live),
  ];
  const passes = diagnoses.flatMap((diagnosis) => diagnosis.passes);
  const failures = diagnoses.flatMap((diagnosis) => diagnosis.failures);

  const compatibility = checkCompatibility(live, config.registry);
  const compatibilityFailures: string[] = [];
  if (compatibility.compatible) {
    passes.push(`${compatibility.checked} live route(s) match the current registry`);
  } else {
    compatibilityFailures.push(...formatCompatibilityReport(compatibility).split("\n"));
  }

  const problemCount = failures.length + compatibility.incompatible.length;

  return {
    lines: [
      ...passes.map((line) => `✓ ${line}`),
      ...failures.map((line) => `✗ ${line}`),
      ...compatibilityFailures.map((line) => `✗ ${line}`),
      problemCount === 0
        ? "doctor found no contract problems"
        : `doctor found ${problemCount} problem(s)`,
    ],
    code: problemCount === 0 ? ExitCode.Done : ExitCode.Refused,
  };
};
