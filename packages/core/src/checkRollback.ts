import type { Artifact } from "./artifact.types";
import type { Registry } from "./registry.types";
import type { RollbackCheck } from "./rollback.types";

// Compares what the artifact was compiled against with the registry live now. A name the
// registry no longer holds is drift, not an absent check — a deleted block is exactly the
// failure a rollback must be warned about.

/**
 * Asks whether one stored artifact would still render against a registry — the question to
 * settle before pointing a route back at it. Every name in the artifact's `blockVersions` has to
 * be registered at the version recorded there; a different version, or no entry at all, is drift.
 *
 * @param artifact - The rollback target, as read back from the store. Only `blockVersions` is
 * read, so an artifact hand-built for a test needs nothing else to be accurate.
 * @param registry - The registry the running code holds now, from `createRegistry`.
 * @returns `{ compatible: true }`, or `{ compatible: false, drifted }` naming every block that
 * moved. Drift is a value, not a throw: whether it stops the rollback is the caller's call.
 * @example
 * ```ts
 * import { checkRollback, createRegistry, defineBlock } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const heroAtV2 = defineBlock({
 *   name: "Hero",
 *   schema: z.object({ title: z.string() }),
 *   component: null,
 *   version: 2,
 *   slots: {},
 * });
 *
 * // artifact.blockVersions is { Hero: 1 }
 * checkRollback(artifact, createRegistry([heroAtV2]));
 * // { compatible: false, drifted: ["Hero"] }
 * ```
 */
export function checkRollback(artifact: Artifact, registry: Registry): RollbackCheck {
  const drifted = Object.entries(artifact.blockVersions)
    .filter(([name, version]) => registry.get(name)?.version !== version)
    .map(([name]) => name);
  return drifted.length === 0 ? { compatible: true } : { compatible: false, drifted };
}
