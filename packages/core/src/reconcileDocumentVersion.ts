import type { DocumentVersion } from "./document.types";
import { reconcileValue } from "./reconcileValue";
import type { DocumentReconciliation } from "./reconciliation.types";

/** Reconciles two descendants of one document version without discarding either side's work. */
export function reconcileDocumentVersion(
  base: DocumentVersion,
  local: DocumentVersion,
  remote: DocumentVersion,
): DocumentReconciliation {
  if (base.documentId !== local.documentId || base.documentId !== remote.documentId) {
    throw new TypeError("cannot reconcile versions from different documents");
  }
  const result = reconcileValue(
    { present: true, value: base },
    { present: true, value: local },
    { present: true, value: remote },
  );
  return {
    version: result.value.value as DocumentVersion,
    conflicts: result.conflicts,
  };
}
