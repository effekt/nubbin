import type { Manifest } from "@nubbin/core";
import type { DoctorDiagnosis } from "./doctorDiagnosis.types";

/** Finds repeated route identities in the store's advisory manifest. */
export function diagnoseManifest(manifest: Manifest): DoctorDiagnosis {
  const seen = new Set<string>();
  const failures = manifest.routes.flatMap((pointer) => {
    const repeated = seen.has(pointer.route);
    seen.add(pointer.route);
    return repeated ? [`${pointer.route} appears more than once in the manifest`] : [];
  });
  return {
    passes:
      failures.length === 0 ? [`manifest has ${manifest.routes.length} unique live route(s)`] : [],
    failures,
  };
}
