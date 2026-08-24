/**
 * What `checkRollback` reports about one artifact against one registry. Discriminate on
 * `compatible` — the drifted names exist only on the failing branch, so a check narrows before
 * anything can read them.
 *
 * @example
 * ```ts
 * import { checkRollback } from "@nubbin/core";
 * import type { RollbackCheck } from "@nubbin/core";
 *
 * const verdict: RollbackCheck = checkRollback(artifact, registry);
 * if (!verdict.compatible) {
 *   console.error(`refusing the rollback: ${verdict.drifted.join(", ")} moved since compile`);
 * }
 * ```
 */
export type RollbackCheck =
  | {
      /** Every block the artifact names is registered at the version it was compiled against. */
      compatible: true;
    }
  | {
      /** At least one block the artifact names is registered at another version, or not at all. */
      compatible: false;
      /**
       * The names of the drifted blocks, in the order the artifact's `blockVersions` lists them.
       * A block the registry no longer holds is named here too — deletion is drift.
       */
      drifted: string[];
    };
