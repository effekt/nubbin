import type { DocumentVersion } from "@nubbin/core";

/**
 * Whether an untrusted value has a `DocumentVersion`'s fields — shape, not validity. The
 * compiler judges what the fields hold; this only refuses bodies that could not be a
 * document at all, so a garbage save is the client's fault rather than a draft file the
 * studio then chokes on. Nodes are not walked: an element the compiler refuses is still a
 * savable draft.
 */
export function isDocumentVersionShape(value: unknown): value is DocumentVersion {
  if (typeof value !== "object" || value === null) {
    return false;
  }
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
