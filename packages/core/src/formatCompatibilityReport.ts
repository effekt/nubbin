import type { CompatibilityReport } from "./compatibility.types";
import { formatRouteIncompatibility } from "./formatRouteIncompatibility";

// The report as a CI log reads it. `checked` leads every line, including the passing one: a run
// that found no pointers and a run that cleared eight are the same word otherwise, and the first
// of those is a gate certifying nothing.

/**
 * Renders a report as the plain text a CI log or a terminal wants — one line when everything
 * cleared, otherwise a counted heading followed by each broken route with its blocks indented
 * beneath it. The count of pointers examined opens both forms, so a run that read an empty store
 * cannot be mistaken for a run that cleared a full one.
 *
 * @param report - A report from `checkCompatibility`, or any value of that shape.
 * @returns The whole report as one string, newline-separated and with no trailing newline. Split
 * it on `\n` for a logger that takes lines.
 * @example
 * ```ts
 * import { checkCompatibility, formatCompatibilityReport } from "@nubbin/core";
 *
 * formatCompatibilityReport(checkCompatibility(live, registry));
 * // 1 of 8 live route pointer(s) are incompatible with this registry:
 * //   /  (artifact 4a162726)
 * //     Hero: page needs v1, no longer in the registry
 * ```
 */
export function formatCompatibilityReport(report: CompatibilityReport): string {
  if (report.compatible) {
    return `${report.checked} live route pointer(s) checked; every one is compatible with this registry.`;
  }
  const summary = `${report.incompatible.length} of ${report.checked} live route pointer(s) are incompatible with this registry:`;
  return [summary, ...report.incompatible.map(formatRouteIncompatibility)].join("\n");
}
