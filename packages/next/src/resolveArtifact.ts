import type { Artifact, ArtifactStore } from "@nubbin/core";
import { routeFromSlug } from "./routeFromSlug";

// The whole production read path: one pointer read, one artifact read. Null means the caller
// renders a real 404 — an unpublished route has no pointer, which is what makes unpublish a
// server 404 rather than an empty page.
/**
 * Resolves whatever is published at a catch-all route: one pointer read, then one artifact read.
 * The page component and `generateMetadata` both want the same answer, so wrap the call in
 * React's `cache` rather than reading the store twice per request.
 *
 * @param store - The store the route was published through. Only `pointer` and `read` are
 *   called, so a read-only implementation serves the whole render path.
 * @param slug - The catch-all param for the request, passed through `routeFromSlug`. `undefined`
 *   and the empty array are the root route.
 * @returns The artifact serving that route, or `null` — for a route with no pointer, and for a
 *   pointer naming a hash the store no longer holds. Absence is a value rather than a failure:
 *   it is what the caller turns into `notFound()`, and it is why unpublishing produces a server
 *   404 instead of an empty page.
 * @throws Whatever the store raises. Both calls answer absence with `null`, so anything thrown
 *   from here is storage failing rather than a route that is not published.
 * @example
 * ```tsx
 * export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
 *   const artifact = await resolveArtifact(store, (await params).slug);
 *   if (!artifact) notFound();
 *   return <Renderer artifact={artifact} registry={blockRegistry} resolveHole={resolveHole} />;
 * }
 * ```
 */
export async function resolveArtifact(
  store: ArtifactStore,
  slug: readonly string[] | undefined,
): Promise<Artifact | null> {
  const pointer = await store.pointer(routeFromSlug(slug));
  if (!pointer) {
    return null;
  }
  return store.read(pointer.hash);
}
