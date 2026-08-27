import type { Catalog, Registry } from "@nubbin/core";
import type { DoctorDiagnosis } from "./doctorDiagnosis.types";

/** Compares the two deliberately separate halves of block registration by name. */
export function diagnoseCatalog(catalog: Catalog, registry: Registry): DoctorDiagnosis {
  const catalogNames = Object.keys(catalog).sort();
  const registryNames = registry.names().sort();
  const failures = [
    ...catalogNames
      .filter((name) => !registryNames.includes(name))
      .map((name) => `${name} is in the catalog but not the registry`),
    ...registryNames
      .filter((name) => !catalogNames.includes(name))
      .map((name) => `${name} is in the registry but not the catalog`),
  ];
  return {
    passes:
      failures.length === 0
        ? [`catalog and registry agree on ${catalogNames.length} block(s)`]
        : [],
    failures,
  };
}
