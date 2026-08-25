import type { NubbinError } from "@nubbin/core";

/** Serializes a Nubbin refusal in the common editor issue envelope. */
export function nubbinRefusalResponse(error: NubbinError, status?: number): Response {
  return Response.json(
    { ok: false, issues: error.issues },
    status === undefined ? undefined : { status },
  );
}
