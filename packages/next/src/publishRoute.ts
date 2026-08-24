import type { ArtifactStore } from "@nubbin/core";
// `next/cache.js`, not `next/cache`: Next ships no `exports` map, and ESM does not do
// extension resolution, so the bare subpath resolves only through a bundler. A publish
// script run with plain node is a legitimate consumer of this function.
import { revalidatePath } from "next/cache.js";

// Pointer first, invalidation second. The reverse order re-caches the outgoing page during
// the gap, and the publish appears to have silently not happened. The store's own publish
// rejects a hash that was never written, so a failed publish never purges a working page.
/**
 * Points a route at an artifact and invalidates that one page, in that order — the body of the
 * `POST /api/nubbin/publish` handler an application exposes, which is where `nubbin publish
 * --origin <url>` sends `{ route, hash }`.
 *
 * `revalidatePath` reaches only the cache of the process that runs it, so this has to run inside
 * the server that serves the page. Moving the pointer from a terminal instead leaves that server
 * answering from its cache until it restarts.
 *
 * @param store - The store serving the application. `publish` is the only method called.
 * @param route - The route to serve, exactly as it was compiled — `resolveArtifact` matches a
 *   pointer by its route string, so a route published under a different spelling never resolves.
 * @param hash - The artifact to serve there. Write it first: this moves a pointer and never
 *   stores anything, and a pointer at a hash nothing has written is a live 404.
 * @returns Nothing. Publishing the same route and hash twice is a no-op in the store and
 *   invalidates the page again, so a retried publish is safe.
 * @throws Whatever `store.publish` raises, before anything is invalidated — a store rejecting an
 *   unwritten hash or an unaddressable route leaves the page that is live untouched.
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   const { route, hash } = (await request.json()) as { route: string; hash: string };
 *   await publishRoute(store, route, hash);
 *   return Response.json({ ok: true, route, hash });
 * }
 * ```
 */
export async function publishRoute(
  store: ArtifactStore,
  route: string,
  hash: string,
): Promise<void> {
  await store.publish(route, hash);
  revalidatePath(route);
}
