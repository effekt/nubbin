import { NubbinIssueCode, refuse } from "@nubbin/core";
/**
 * A write-side method for a store the read path holds. Throwing names the operation, so a
 * test that accidentally writes fails saying which call it was rather than timing out.
 */
export function refuseWrite(operation: string): () => never {
  return () => {
    refuse(
      NubbinIssueCode.ArtifactNotStored,
      `stubStore.${operation}: the read path must never write`,
      operation,
    );
  };
}
