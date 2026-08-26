import { isPlainRecord } from "./isPlainRecord";
import type { ReconciliationValue } from "./reconciliation.types";

/** Returns the record carried by a present reconciliation value. */
export function toPlainRecord(value: ReconciliationValue): Record<string, unknown> | undefined {
  return value.present && isPlainRecord(value.value) ? value.value : undefined;
}
