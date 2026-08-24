import type { Artifact, RoutePointer } from "./artifact.types";

// One route pointer and the artifact it names, as an adapter read them.

/**
 * One live route, ready for `checkCompatibility`: a pointer and whatever the store returned for
 * its hash. Build one per pointer in the manifest.
 *
 * @example
 * ```ts
 * import type { LiveRoute } from "@nubbin/core";
 *
 * const live: LiveRoute[] = await Promise.all(
 *   routes.map(async (pointer) => ({ pointer, artifact: await store.read(pointer.hash) })),
 * );
 * ```
 */
export interface LiveRoute {
  /** The pointer as the store holds it — `route` and `hash` name the failure in the report. */
  pointer: RoutePointer;
  // `null` when the store holds no artifact at the pointer's hash — a pointer into nothing.
  /**
   * What `store.read(pointer.hash)` returned. Pass the `null` through rather than skipping the
   * route: an unresolvable hash is reported as its own kind of breakage.
   */
  artifact: Artifact | null;
}

// One block's version delta between what a live artifact needs and what is registered now.

/**
 * One block's version delta, as it appears under a `block-drift` incompatibility. Enough to act
 * on without reading the artifact: the name, what the page needs, and what the registry holds.
 *
 * @example
 * ```ts
 * import type { BlockDrift } from "@nubbin/core";
 *
 * const drift: BlockDrift = { block: "Hero", live: 1, registered: 2 };
 * ```
 */
export interface BlockDrift {
  /** The block's registered name, as `blockVersions` keys it. */
  block: string;
  // The version the artifact was compiled against.
  /** The version the live page needs — restore this to make the route renderable again. */
  live: number;
  // The version registered now — `null` when the registry no longer holds the block at all.
  /** The version the registry holds now, or `null` when the block is no longer registered. */
  registered: number | null;
}

// Why one live route would not render. `unreadable-artifact` is a pointer whose hash the store
// cannot resolve, which breaks the route without any registry change at all.

/**
 * One route that would not render, and why. Discriminate on `reason`: `drifted` exists only on
 * the `block-drift` branch, since an unresolvable hash has no versions to compare.
 *
 * @example
 * ```ts
 * for (const failure of report.incompatible) {
 *   if (failure.reason === "unreadable-artifact") {
 *     console.error(`${failure.route}: nothing stored at ${failure.hash}`);
 *   } else {
 *     console.error(`${failure.route}: ${failure.drifted.map((d) => d.block).join(", ")}`);
 *   }
 * }
 * ```
 */
export type RouteIncompatibility =
  | {
      /** The route whose pointer was checked. */
      route: string;
      /** The hash that pointer names. */
      hash: string;
      /** The store returned nothing for the hash, so the route is broken with no drift involved. */
      reason: "unreadable-artifact";
    }
  | {
      /** The route whose pointer was checked. */
      route: string;
      /** The hash that pointer names — what would render, if its blocks still matched. */
      hash: string;
      /** The artifact read cleanly, and at least one block it needs has moved. */
      reason: "block-drift";
      /** Every moved block, one entry each. Blocks that still match are not listed. */
      drifted: BlockDrift[];
    };

// The verdict over every live pointer. `checked` is reported so a run over nothing cannot read
// as a pass.

/**
 * What `checkCompatibility` returns over a whole set of live routes. Assert on `checked` before
 * trusting `compatible` — a run that read no pointers is compatible with everything.
 *
 * @example
 * ```ts
 * const report = checkCompatibility(live, registry);
 * if (report.checked === 0) throw new Error("no live pointers read — this gate checked nothing");
 * process.exitCode = report.compatible ? 0 : 1;
 * ```
 */
export interface CompatibilityReport {
  /** How many live routes were examined — the length of the `live` array passed in. */
  checked: number;
  /** `true` when `incompatible` is empty, including when nothing was checked. */
  compatible: boolean;
  /** One entry per route that would not render, in the order the routes were passed in. */
  incompatible: RouteIncompatibility[];
}
