import { isPlainRecord } from "./isPlainRecord";
import type { ReconciliationValue } from "./reconciliation.types";

/** Structural equality for JSON-shaped authoring values, independent of object key order. */
export function sameReconciliationValue(
  left: ReconciliationValue,
  right: ReconciliationValue,
): boolean {
  if (left.present !== right.present) return false;
  if (!left.present) return true;
  if (Object.is(left.value, right.value)) return true;
  if (Array.isArray(left.value) && Array.isArray(right.value)) {
    const leftArray = left.value;
    const rightArray = right.value;
    return (
      leftArray.length === rightArray.length &&
      leftArray.every((value, index) =>
        sameReconciliationValue(
          { present: true, value },
          { present: true, value: rightArray[index] },
        ),
      )
    );
  }
  if (!isPlainRecord(left.value) || !isPlainRecord(right.value)) return false;
  const leftRecord = left.value;
  const rightRecord = right.value;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key) =>
        Object.hasOwn(rightRecord, key) &&
        sameReconciliationValue(
          { present: true, value: leftRecord[key] },
          { present: true, value: rightRecord[key] },
        ),
    )
  );
}
