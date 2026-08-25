import type { DocumentVersion } from "@nubbin/core";

/** Whether an untrusted value has a document version's fields. This checks transport shape,
 * not content validity; compilation remains the authority over nodes and props. */
export function isDocumentVersionShape(value: unknown): value is DocumentVersion {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.documentId === "string" &&
    typeof record.version === "number" &&
    Array.isArray(record.roots) &&
    typeof record.elements === "object" &&
    record.elements !== null &&
    !Array.isArray(record.elements) &&
    typeof record.meta === "object" &&
    record.meta !== null &&
    typeof record.createdAt === "string" &&
    typeof record.createdBy === "string"
  );
}
