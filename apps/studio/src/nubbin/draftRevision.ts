import { createHash } from "node:crypto";
import type { DocumentVersion } from "@nubbin/core";

/** Opaque content identity for the reference filesystem draft slot. */
export function draftRevision(version: DocumentVersion): string {
  return createHash("sha256").update(JSON.stringify(version)).digest("hex");
}
