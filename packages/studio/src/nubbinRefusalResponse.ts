import type { NubbinError } from "@nubbin/core";
import { issueRefusalResponse } from "./issueRefusalResponse";

/** Serializes a Nubbin refusal in the common editor issue envelope. */
export function nubbinRefusalResponse(error: NubbinError, status?: number): Response {
  return issueRefusalResponse(error.issues, status);
}
