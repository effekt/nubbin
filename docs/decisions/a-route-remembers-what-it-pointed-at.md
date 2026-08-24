---
title: A route remembers what it pointed at
summary: Why the pointer carries a bounded log of what it replaced, rather than the store listing artifacts or the document carrying its own history
status: stable
---

# A route remembers what it pointed at

`publish` records the move: the hash it pointed the route at, the document version that compiled
to it, and when. The store keeps that log **beside the pointer, never inside it**, and hands it
back through an optional `history(route)`.

Only published states appear in it. `publish` is the one operation that moves a pointer, so a
compile that was never published, and an artifact written but never pointed at, are both absent
by construction.

The pointer itself is unchanged.

## What forced it

Rolling back needs the hash of something published earlier, and nothing could produce one. The
pointer holds the current hash and no other, `manifest()` aggregates only current pointers, and
`read` takes a hash the caller must already have. In practice the hash came from scrollback: a
person publishes, sees `published /x -> 9f2c1a…`, and rolls back by finding that line again. A
recovery path that depends on a terminal not having been closed is not a recovery path.

## Why beside the pointer, and not in it

**The pointer is the first thing every render reads.** `resolveArtifact` is one pointer read and
one artifact read, so whatever the pointer carries is parsed on the way to serving a page. A log
of twenty moves is around ten times the size of the pointer that carries it, and the renderer
reads none of it. Keeping it in a sibling record leaves the read path exactly as it is.

It also removes a wrinkle the in-pointer version needed. Unpublishing deletes the pointer, so a
log living inside it would have to leave a tombstone behind to survive — a record with no live
hash, and a `pointer()` that has to know not to return it. A sibling record simply outlives the
pointer, and a route that was taken down can be put back with nothing special about it.

The log is bounded. The entries past the cap fall off, which makes this a rollback aid and not an
audit trail; an audit trail is the authoring store's concern, where a draft that was never
published is also worth keeping.

**The pointer moves first, and the log is appended after.** A failure between the two leaves the
log missing an entry, which under-reports what happened; the reverse order would let it claim a
publish that never went live.

## What it beat

**Carrying the log inside `RoutePointer`.** One file per route, no new capability for an adapter
to implement, and every store gets history for free. Rejected on the read path: the pointer is
read to serve a page, so this makes every render parse a rollback log it never uses, and it needs
a tombstone so unpublishing does not throw the log away.

**Listing the store.** An optional `list()` on `ArtifactStore` would let a route's artifacts be
enumerated and filtered by the `route` each one records. It answers a different question: what
exists, rather than what was live. It also cannot order the results — artifacts deliberately
carry no timestamp, so the best available sort is by document version, which says nothing about
when a version was actually serving.

**Immutable pointer records, linked by hash.** One small file per publish, each naming the one it
replaced, walkable to the beginning of time. It is the shape the rest of this layer already has,
and it was rejected for what it implies: unbounded growth in the store, and with it a garbage
collection question this project has not taken on. A bounded log answers the rollback case
without opening that.

**A revision history inside the document.** Every published version kept in the document itself.
It inflates the one thing that gets read on every publish, and it stores drafts that were never
live beside states that were — which is exactly the distinction rollback depends on.
