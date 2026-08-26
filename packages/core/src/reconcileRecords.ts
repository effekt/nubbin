import type {
  DocumentConflict,
  ReconciliationValue,
  RecordsToReconcile,
  ValueReconciliation,
} from "./reconciliation.types";
import { reconciliationValueAt } from "./reconciliationValueAt";

type Reconcile = (
  base: ReconciliationValue,
  local: ReconciliationValue,
  remote: ReconciliationValue,
  path?: readonly string[],
) => ValueReconciliation;

/** Recursively combines fields after all three values have been narrowed to records. */
export function reconcileRecords(
  [base, local, remote]: RecordsToReconcile,
  path: readonly string[],
  reconcile: Reconcile,
) {
  const merged: Record<string, unknown> = {};
  const conflicts: DocumentConflict[] = [];
  const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);
  for (const key of keys) {
    const result = reconcile(
      reconciliationValueAt(base, key),
      reconciliationValueAt(local, key),
      reconciliationValueAt(remote, key),
      [...path, key],
    );
    if (result.value.present) merged[key] = result.value.value;
    conflicts.push(...result.conflicts);
  }
  return { value: { present: true as const, value: merged }, conflicts };
}
