import type { DocumentVersion } from "./document.types";
import type { DocumentConflict } from "./reconciliation.types";
import { withReconciliationValueAtPath } from "./withReconciliationValueAtPath";

/** Applies one explicit local-or-remote conflict choice to a reconciled working document. */
export function resolveDocumentConflict(
  version: DocumentVersion,
  conflict: DocumentConflict,
  choice: "local" | "remote",
): DocumentVersion {
  return withReconciliationValueAtPath(version, conflict.path, conflict[choice]);
}
