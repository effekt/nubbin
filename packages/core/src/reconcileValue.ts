import { reconcileRecords } from "./reconcileRecords";
import type {
  ReconciliationValue,
  RecordsToReconcile,
  ValueReconciliation,
} from "./reconciliation.types";
import { sameReconciliationValue } from "./sameReconciliationValue";
import { toPlainRecord } from "./toPlainRecord";

/** Three-way reconciliation for one JSON-shaped value. Conflicts retain the local value. */
export function reconcileValue(
  base: ReconciliationValue,
  local: ReconciliationValue,
  remote: ReconciliationValue,
  path: readonly string[] = [],
): ValueReconciliation {
  if (sameReconciliationValue(local, remote)) return { value: local, conflicts: [] };
  if (sameReconciliationValue(local, base)) return { value: remote, conflicts: [] };
  if (sameReconciliationValue(remote, base)) return { value: local, conflicts: [] };
  const records = [toPlainRecord(base), toPlainRecord(local), toPlainRecord(remote)] as const;
  if (records.some((value) => value === undefined)) {
    return { value: local, conflicts: [{ path, base, local, remote }] };
  }
  return reconcileRecords(records as RecordsToReconcile, path, reconcileValue);
}
