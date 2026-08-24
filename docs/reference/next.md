---
title: The Next.js Binding
summary: The @nubbin/next surface as shipped — route resolution, static params, hole fetch options, and the two publish calls
status: reference
---

# The Next.js binding

This page describes the shipped surface of `@nubbin/next`:
[`resolveArtifact`](generated/@nubbin/next/functions/resolveArtifact.md),
[`routeFromSlug`](generated/@nubbin/next/functions/routeFromSlug.md),
[`staticRouteParams`](generated/@nubbin/next/functions/staticRouteParams.md),
[`holeFetchOptions`](generated/@nubbin/next/functions/holeFetchOptions.md),
[`artifactMetadata`](generated/@nubbin/next/functions/artifactMetadata.md),
[`publishRoute`](generated/@nubbin/next/functions/publishRoute.md) and
[`unpublishRoute`](generated/@nubbin/next/functions/unpublishRoute.md), each signature generated
from the source it belongs to. Every one takes an `ArtifactStore` or a core type and holds no
state of its own, so a consumer substituting a different store or a different framework replaces
the binding and keeps the contract.

## Reading a route

`resolveArtifact` is the whole production read path: one pointer read, then one artifact read.

**`null` means the caller renders a real 404.** An unpublished route has no pointer, which is
what makes unpublishing produce a server 404 rather than an empty page.

`routeFromSlug` turns catch-all params into the route string that artifacts and pointers are
keyed by. An absent or empty slug is `"/"`; otherwise the segments are joined under a leading
slash.

## `staticRouteParams`

A `generateStaticParams` source. It reads `store.manifest()`, which is advisory and exists for
exactly this — no request is ever served through it.

Pointers whose `matchKind` is not `"exact"` are excluded because pattern routing remains
unsettled.

## `holeFetchOptions`

Maps a hole's declared lifecycle onto Next's fetch cache, so the mapping is owned by the binding
rather than re-decided inside every consumer's resolver. A `{ revalidate: n }` spec becomes
`{ next: { revalidate: n } }`, which leaves the page cacheable and refreshes the value on that
interval.

## `publishRoute` and `unpublishRoute`

**Pointer first, invalidation second.** The reverse order re-caches the outgoing page during the
gap, and the publish then appears to have silently not happened. The store's own `publish`
rejects a hash that was never written, so a failed publish never purges a working page.

`unpublishRoute` removes the pointer and invalidates that one route, so the next request renders
a real 404.

Both import `revalidatePath` from `next/cache.js` rather than `next/cache`. Next ships no
`exports` map and ESM does not do extension resolution, so the bare subpath resolves only
through a bundler — and a publish script run under plain node is a legitimate consumer.
