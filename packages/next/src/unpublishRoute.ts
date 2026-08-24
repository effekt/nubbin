import type { ArtifactStore } from "@nubbin/core";
// `next/cache.js`, not `next/cache`: Next ships no `exports` map, and ESM does not do
// extension resolution, so the bare subpath resolves only through a bundler. A publish
// script run with plain node is a legitimate consumer of this function.
import { revalidatePath } from "next/cache.js";

// Pointer removed, then that one route invalidated — the next request renders a real 404.
/**
 * Takes a route offline and invalidates that one page — the body of the
 * `POST /api/nubbin/unpublish` handler an application exposes, which is where `nubbin unpublish
 * --origin <url>` sends `{ route }`.
 *
 * Like `publishRoute`, it has to run inside the serving process: `revalidatePath` reaches only
 * that process's cache, so a pointer dropped from a terminal leaves the page still being served.
 *
 * @param store - The store serving the application. `unpublish` is the only method called.
 * @param route - The route to stop serving, exactly as it was published.
 * @returns Nothing. The artifact stays readable at its hash — only the pointer goes — so
 *   restoring the route is a `publishRoute` at the same hash.
 * @throws Whatever `store.unpublish` raises, before anything is invalidated. Unpublishing a
 *   route with no pointer is a no-op rather than a refusal.
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   const { route } = (await request.json()) as { route: string };
 *   await unpublishRoute(store, route);
 *   return Response.json({ ok: true, route });
 * }
 * ```
 */
export async function unpublishRoute(store: ArtifactStore, route: string): Promise<void> {
  await store.unpublish(route);
  revalidatePath(route);
}
