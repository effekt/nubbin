import type { DocumentVersion } from "@nubbin/core";

/** Small valid document for host contract tests and examples. */
export function draftVersionFixture(): DocumentVersion {
  return {
    documentId: "contract-document",
    version: 1,
    roots: ["root"],
    elements: {
      root: { id: "root", block: "ContractBlock", props: { title: "Initial" } },
    },
    meta: { title: "Initial" },
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "contract-suite",
  };
}
