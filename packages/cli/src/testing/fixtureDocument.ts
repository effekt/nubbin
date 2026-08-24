import type { DocumentVersion } from "@nubbin/core";

/** Documents for the command tests, so each fixture below is its elements and nothing else.
 * Roots default to the one node most fixtures have. */
export const fixtureDocument = (
  id: string,
  elements: DocumentVersion["elements"],
  roots: readonly string[] = ["n1"],
): DocumentVersion => ({
  documentId: id,
  version: 1,
  roots,
  elements,
  meta: { title: id },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "fixture",
});
