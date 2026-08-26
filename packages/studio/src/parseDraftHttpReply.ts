import type { DraftSaveOutcome } from "./draftSave.types";
import { isDocumentVersionShape } from "./isDocumentVersionShape";

/** Judges the revision-aware draft endpoint reply before Studio changes its working base. */
export function parseDraftHttpReply(body: unknown): DraftSaveOutcome {
  if (typeof body !== "object" || body === null || !("status" in body)) {
    throw new TypeError("the draft endpoint answered with an unrecognised reply");
  }
  const reply = body as Record<string, unknown>;
  if (reply.status === "saved" && typeof reply.revision === "string") {
    return {
      status: "saved",
      revision: reply.revision,
      ...(Array.isArray(reply.issues) ? { issues: reply.issues } : {}),
    };
  }
  if (
    reply.status === "conflict" &&
    typeof reply.revision === "string" &&
    isDocumentVersionShape(reply.version)
  ) {
    return { status: "conflict", revision: reply.revision, version: reply.version };
  }
  if (reply.status === "missing") return { status: "missing" };
  throw new TypeError("the draft endpoint answered with an unrecognised reply");
}
