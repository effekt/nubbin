import type { FieldHintData } from "@nubbin/core";

// Maps a hole's declared lifecycle onto Next's fetch cache, so the mapping is owned by the
// binding rather than re-decided in every consumer's resolver.
//
// Takes core's `FieldHintData` directly. An earlier plan derived a local `HoleSpec` from
// `ArtifactNode["holes"]` so two packages would not import each other; core exports the type
// by name, so both import it from core and neither derivation is needed.
/**
 * Turns a hole's declared lifecycle into the `fetch` options Next reads, for a `resolveHole`
 * fetching the value that fills it.
 *
 * @param spec - The hole's `FieldHintData`, as `compile` copied it from the block's `ui.fields`
 *   hint into the artifact node's `holes`. Pass it through rather than choosing an interval at
 *   the call site: the published artifact is what says how live the value is.
 * @returns `{ next: { revalidate: spec.revalidate } }`, ready to spread into a `fetch` call.
 *   `0` reaches Next as `0` rather than being read as absent, which is Next's instruction not to
 *   cache the response at all.
 * @example
 * ```ts
 * import type { HoleResolver } from "@nubbin/react";
 *
 * const resolveHole: HoleResolver = async ({ spec }) => {
 *   const response = await fetch(`${origin}/api/price`, holeFetchOptions(spec));
 *   return response.json();
 * };
 * ```
 */
export function holeFetchOptions(spec: FieldHintData): RequestInit & {
  next: { revalidate: number };
} {
  return { next: { revalidate: spec.revalidate } };
}
