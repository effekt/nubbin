import type { Artifact } from "./artifact.types";
import type { NubbinIssue } from "./nubbinIssue.types";

// The two travel together because the split is not severity, it is whether an artifact exists.
// A document the schema refuses has none, and `compile` throws; a document carrying a key the
// schema did not declare has a perfectly good one, and what became of that key is the consumer's
// to log, ship, or ignore.
/**
 * What `compile` returns whenever it produced an artifact. Receiving one of these means the
 * document compiled; a document that did not reaches the caller as a thrown `NubbinError`
 * instead.
 *
 * @example
 * ```ts
 * const { artifact, issues } = compile(version, catalog, registry, "/pricing");
 *
 * await store.write(artifact);
 * await store.publish(artifact.route, artifact.hash);
 *
 * for (const issue of issues) {
 *   logger.warn({ code: issue.code, at: issue.at, path: issue.path, message: issue.message });
 * }
 * ```
 */
export interface CompileResult {
  /**
   * The compiled document: immutable, addressed by its own `hash`, and ready to hand to a store.
   * `tree` holds one denormalized tree per entry in the document's `roots`, in that order.
   */
  artifact: Artifact;
  /**
   * Everything `compile` has to say about the document that did not stop it producing one. A key
   * an author wrote and the schema did not keep arrives here as `unknown-prop`, naming the node
   * in `at` and the dotted path in `path`. Empty means nothing was dropped.
   *
   * These do not change the content address: two documents differing only by a key the schema
   * never kept compile to the same `hash`, because they render identically.
   */
  issues: readonly NubbinIssue[];
}
