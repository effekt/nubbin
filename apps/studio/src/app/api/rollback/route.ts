import { createRollbackRequestHandler } from "@nubbin/studio";
import { rollbackArtifact } from "../../../nubbin/rollbackArtifact";

/**
 * Rollback is a pointer move: the target artifact already sits in the store, so nothing
 * compiles — the route is pointed back at it through the consumer's origin, the same path
 * publish takes, because the pointer must move inside the process that serves the page. The
 * guard is `checkRollback` against the running registry: drift refuses with issues in
 * publish's `{ok: false, issues}` shape, so the editor translates them the same way. An
 * artifact compiled for another route is refused however plausible the hash looks.
 * Unauthenticated like its siblings: the studio deploys behind the consumer's own gate.
 */
export const POST = createRollbackRequestHandler(rollbackArtifact);
