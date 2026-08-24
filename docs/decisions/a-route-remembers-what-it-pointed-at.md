---
title: A route remembers what it pointed at
summary: Why the pointer carries a bounded log of what it replaced, rather than the store listing artifacts or the document carrying its own history
status: stable
---

# A route remembers what it pointed at

`RoutePointer` carries a bounded log of the artifacts the route pointed at before, most recent
first — the hash, the document version it compiled from, and when the move happened. Publishing
prepends to it; unpublishing leaves the record without a live hash, so a route that was taken
down can still be put back.

Only published states appear in it. `publish` is the one operation that moves a pointer, so a
compile that was never published, and an artifact written but never pointed at, are both absent
by construction.

## What forced it

Rolling back needs the hash of something published earlier, and nothing could produce one. The
pointer holds the current hash and no other, `manifest()` aggregates only current pointers, and
`read` takes a hash the caller must already have. In practice the hash came from scrollback: a
person publishes, sees `published /x -> 9f2c1a…`, and rolls back by finding that line again. A
recovery path that depends on a terminal not having been closed is not a recovery path.

## Why on the pointer

The pointer is already the only mutable thing in the output layer, so keeping the log there adds
no new kind of state and no new file. Artifacts stay immutable, content-addressed and one per
file — nothing about them changes, and nothing needs rewriting when a route moves.

It is bounded on purpose. The entries past the cap fall off, which makes this a rollback aid and
not an audit trail; an audit trail is the authoring store's concern, where a draft that was never
published is also worth keeping.

## What it beat

**Listing the store.** An optional `list()` on `ArtifactStore` would let a route's artifacts be
enumerated and filtered by the `route` each one records. It answers a different question: what
exists, rather than what was live. It also cannot order the results — artifacts deliberately
carry no timestamp, so the best available sort is by document version, which says nothing about
when a version was actually serving. And every adapter would have to implement it or the command
would work in some stores and not others.

**Immutable pointer records, linked by hash.** One small file per publish, each naming the one it
replaced, walkable to the beginning of time. It is the shape the rest of this layer already has,
and it was rejected for what it implies: unbounded growth in the store, and with it a garbage
collection question this project has not taken on. A bounded log answers the rollback case
without opening that.

**A revision history inside the document.** Every published version kept in the document itself.
It inflates the one thing that gets read on every publish, and it stores drafts that were never
live beside states that were — which is exactly the distinction rollback depends on.
