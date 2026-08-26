import type { DocumentVersion } from "./document.types";

/** One value as it existed at a conflicting path. `present` distinguishes deletion from `undefined`. */
export interface ReconciliationValue {
  readonly present: boolean;
  readonly value?: unknown;
}

/** A path changed differently in both descendants of the same base. */
export interface DocumentConflict {
  readonly path: readonly string[];
  readonly base: ReconciliationValue;
  readonly local: ReconciliationValue;
  readonly remote: ReconciliationValue;
}

/** A local-first working copy plus every choice an author still has to make. */
export interface DocumentReconciliation {
  readonly version: DocumentVersion;
  readonly conflicts: readonly DocumentConflict[];
}

/** Three record values narrowed for recursive reconciliation. */
export type RecordsToReconcile = readonly [
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
];

/** Internal result shared by the recursive value reconciler and the document entry point. */
export interface ValueReconciliation {
  readonly value: ReconciliationValue;
  readonly conflicts: readonly DocumentConflict[];
}
