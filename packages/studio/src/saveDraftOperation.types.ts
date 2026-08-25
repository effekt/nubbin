import type { DocumentVersion } from "@nubbin/core";

/** Host-owned draft persistence and validation behind Studio's HTTP boundary. */
export type SaveDraftOperation = (
  route: string,
  version: DocumentVersion,
) => "saved" | "missing" | Promise<"saved" | "missing">;
