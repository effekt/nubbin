import type { ArtifactStore } from "@nubbin/core";

// generateStaticParams source. manifest() is an advisory read for exactly this — no request
// ever goes through it. Non-exact pointers are excluded until #5 settles pattern routing.
/**
 * Every published route that can be prebuilt, shaped as the params a catch-all segment's
 * `generateStaticParams` returns.
 *
 * @param store - The store the routes were published through. Only `manifest` is called, and it
 *   is read once per build rather than per request.
 * @returns One `{ slug }` per exact pointer, in whatever order the manifest came back in; the
 *   root route is `{ slug: [] }`. A `param` or `prefix` pointer — `/guides/[city]`, `/docs/*` —
 *   is left out, because its route string is a pattern rather than a path and prebuilding it
 *   would name a page that does not exist.
 * @throws Whatever the store raises reading its manifest. An empty manifest is an empty array,
 *   which is a build that prebuilds nothing rather than a failure.
 * @example
 * ```ts
 * export const generateStaticParams = () => staticRouteParams(store);
 * ```
 */
export async function staticRouteParams(store: ArtifactStore): Promise<{ slug: string[] }[]> {
  const { routes } = await store.manifest();
  return routes
    .filter((pointer) => pointer.matchKind === "exact")
    .map((pointer) => ({ slug: pointer.route.split("/").filter((segment) => segment.length > 0) }));
}
