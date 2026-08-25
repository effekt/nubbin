import type { RollbackOutcome } from "./rollbackOutcome.types";

/** Host operation used by the reusable rollback HTTP boundary. */
export type RollbackOperation = (
  route: string,
  hash: string,
) => RollbackOutcome | Promise<RollbackOutcome>;
