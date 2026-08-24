import type { DocumentVersion } from "@nubbin/core";
import { titleFromRoute } from "./titleFromRoute";

/** The version a brand-new page starts from: a fresh `documentId`, no roots and no
 * elements — Puck shows the empty canvas and the root slot invites the first block. It is
 * a draft, so it may sit unpublishable indefinitely; `compile` refuses an empty document
 * as `no-roots`, and publish stays the gate. The id is minted here because `core` reaches
 * no `crypto` builtin by design. */
export function blankDraft(route: string): DocumentVersion {
  return {
    documentId: crypto.randomUUID(),
    version: 1,
    roots: [],
    elements: {},
    meta: { title: titleFromRoute(route) },
    createdAt: new Date().toISOString(),
    createdBy: "studio",
  };
}
