import { checkRollback } from "./checkRollback";
import type { CompatibilityReport, LiveRoute, RouteIncompatibility } from "./compatibility.types";
import { describeDrift } from "./describeDrift";
import type { Registry } from "./registry.types";

// The guardrail's whole question: would this registry fail to render an artifact a live route
// pointer currently references? `checkRollback` decides each route — one artifact against the
// registry is the same comparison whether a pointer is moving or a registry is — and this walks
// every pointer the caller read, so publishing and merging are held to one rule.
//
// Pure, and synchronous: the caller reads the store and hands over what it found, so this runs
// in CI, in a worker, or in a browser studio unchanged.

/**
 * Runs the rollback comparison over every live route at once, and reports each failure with the
 * version delta behind it: which route, which artifact, which block, what the page needs, what is
 * registered. Point a CI job at it before merging a registry change to learn which pages the
 * change would break.
 *
 * @param live - Every pointer worth checking, each paired with the artifact its hash resolves to.
 * Read them from an `ArtifactStore` — a pointer the store cannot resolve is passed as `null`
 * rather than dropped, because that route is already broken. Nothing here reads the store itself,
 * so a caller whose live state sits somewhere else can build the pairs by hand.
 * @param registry - The registry to judge them against, from `createRegistry`.
 * @returns A report over the whole set: how many pointers were examined, whether all of them
 * cleared, and one entry per route that did not. A block the registry gained since publish is
 * not drift, so an added block never appears.
 * @example
 * ```ts
 * import { checkCompatibility, formatCompatibilityReport } from "@nubbin/core";
 * import type { LiveRoute } from "@nubbin/core";
 *
 * const { routes } = await store.manifest();
 * const live: LiveRoute[] = await Promise.all(
 *   routes.map(async (pointer) => ({ pointer, artifact: await store.read(pointer.hash) })),
 * );
 *
 * const report = checkCompatibility(live, registry);
 * console.log(formatCompatibilityReport(report));
 * if (!report.compatible) process.exitCode = 1;
 * ```
 */
export function checkCompatibility(
  live: readonly LiveRoute[],
  registry: Registry,
): CompatibilityReport {
  const incompatible = live.flatMap<RouteIncompatibility>(({ pointer, artifact }) => {
    const { route, hash } = pointer;
    if (artifact === null) {
      return [{ route, hash, reason: "unreadable-artifact" }];
    }
    const check = checkRollback(artifact, registry);
    return check.compatible
      ? []
      : [
          {
            route,
            hash,
            reason: "block-drift",
            drifted: describeDrift(artifact, registry, check.drifted),
          },
        ];
  });
  return { checked: live.length, compatible: incompatible.length === 0, incompatible };
}
