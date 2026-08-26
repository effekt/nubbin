import type { ReconciliationValue } from "./reconciliation.types";

/** Copy-on-write replacement or deletion at one reconciliation path. */
export function withReconciliationValueAtPath<Root extends object>(
  root: Root,
  path: readonly string[],
  replacement: ReconciliationValue,
): Root {
  const [head, ...tail] = path;
  if (head === undefined) return root;
  const record = root as Record<string, unknown>;
  const result = { ...record };
  if (tail.length === 0) {
    if (replacement.present) result[head] = replacement.value;
    else delete result[head];
    return result as Root;
  }
  const child = record[head];
  if (typeof child !== "object" || child === null || Array.isArray(child)) return root;
  result[head] = withReconciliationValueAtPath(child as Record<string, unknown>, tail, replacement);
  return result as Root;
}
