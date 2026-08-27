import { type LiveRoute, parseMatchKind } from "@nubbin/core";
import type { DoctorDiagnosis } from "./doctorDiagnosis.types";

/** Checks that each pointer carries values derived from, and resolving back to, its route. */
export function diagnosePointers(live: readonly LiveRoute[]): DoctorDiagnosis {
  const failures = live.flatMap(({ pointer, artifact }) => {
    const found: string[] = [];
    try {
      const expected = parseMatchKind(pointer.route);
      if (pointer.matchKind !== expected) {
        found.push(
          `${pointer.route} has match kind ${pointer.matchKind}; its route requires ${expected}`,
        );
      }
    } catch {
      found.push(`${pointer.route} is not a valid route`);
    }
    if (artifact !== null && artifact.hash !== pointer.hash) {
      found.push(`${pointer.route} resolved ${pointer.hash} to artifact ${artifact.hash}`);
    }
    if (artifact !== null && artifact.route !== pointer.route) {
      found.push(`${pointer.route} points to an artifact compiled for ${artifact.route}`);
    }
    return found;
  });
  return { passes: [], failures };
}
