import type { DocumentVersion } from "@nubbin/core";
import { isDocumentVersionShape } from "./isDocumentVersionShape";

/** The draft endpoint's body, once its shape has been checked. */
export interface DraftSave {
  route: string;
  version: DocumentVersion;
}

/** Checks an untrusted request body against the save shape — `undefined` over a throw, so
 * the endpoint answers a malformed body with its own status. The version is checked for a
 * document's fields only; what they hold is the compiler's judgment, not this one's. */
export function parseDraftSave(body: unknown): DraftSave | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }
  const record = body as Record<string, unknown>;
  const { route, version } = record;
  if (typeof route !== "string" || !isDocumentVersionShape(version)) {
    return undefined;
  }
  return { route, version };
}
