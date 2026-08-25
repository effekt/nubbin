import type { DocumentVersion } from "@nubbin/core";

/** A whole-document save after its untrusted request shape has been checked. */
export interface DraftSave {
  route: string;
  version: DocumentVersion;
}
