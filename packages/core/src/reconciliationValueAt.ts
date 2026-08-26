import type { ReconciliationValue } from "./reconciliation.types";

/** Reads an own property without collapsing an absent value into `undefined`. */
export function reconciliationValueAt(
  record: Record<string, unknown>,
  key: string,
): ReconciliationValue {
  return Object.hasOwn(record, key) ? { present: true, value: record[key] } : { present: false };
}
