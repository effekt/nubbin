import type { DraftSave } from "./draftSave.types";
import { isDocumentVersionShape } from "./isDocumentVersionShape";

/** Checks an untrusted draft-save body while leaving document validity to compilation. */
export function parseDraftSaveRequest(body: unknown): DraftSave | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const { route, version } = body as Record<string, unknown>;
  return typeof route === "string" && isDocumentVersionShape(version)
    ? { route, version }
    : undefined;
}
