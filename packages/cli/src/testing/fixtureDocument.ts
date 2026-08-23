import type { DocumentVersion } from "@nubbin/core";

/** One-root documents for the command tests, so each fixture below is its elements and nothing else. */
export const fixtureDocument = (
  id: string,
  elements: DocumentVersion["elements"],
): DocumentVersion => ({
  documentId: id,
  version: 1,
  roots: ["n1"],
  elements,
  meta: { title: id },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "fixture",
});
