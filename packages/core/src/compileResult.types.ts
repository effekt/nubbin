import type { Artifact } from "./artifact.types";
import type { NubbinIssue } from "./nubbinIssue.types";

/**
 * What `compile` produces: the artifact, and everything it has to say about the document that
 * did not stop it producing one.
 *
 * The two travel together because the split is not severity, it is whether an artifact exists.
 * A document the schema refuses has none, and `compile` throws; a document carrying a key the
 * schema did not declare has a perfectly good one, and what became of that key is the consumer's
 * to log, ship, or ignore.
 */
export interface CompileResult {
  artifact: Artifact;
  issues: readonly NubbinIssue[];
}
