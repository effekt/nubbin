---
title: A route remembers what it pointed at
summary: Why the pointer carries a bounded log of what it replaced, rather than the store listing artifacts or the document carrying its own history
status: stable
---

# A route remembers what it pointed at

`publish` records the move: the hash it pointed the route at, the document version that compiled
to it, and when. The store keeps that record **beside the pointer, never inside it, and appended
rather than rewritten** — one line per publish, one log per route — and hands it back through an
optional `history(route)`.

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

**Appended, never rewritten.** A log held as one JSON array has to be read, extended and written
back, and that is the shared file this store exists not to have: two publishes of one route race,
and the loser's entry disappears while both pages really were live. An append writes only the new
line, so a concurrent publish costs an interleaving at worst and never a lost entry. It is also
why the log is not bounded in the file — trimming it would mean rewriting it, which is the thing
being avoided; a store that wants a cap can roll the file the way any log is rolled.

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

**One immutable record per publish, linked by hash.** The shape the rest of this layer already
has, and walkable to the beginning of time. Growth alone is not the argument against it — the
store already keeps every artifact forever and collects no garbage. The argument is that
artifacts *deduplicate*: republishing an unchanged document writes no new file, because the hash
is the same. A move record carries a timestamp, so it is unique every time and cannot dedupe —
an hourly republish of an unchanged page would add nothing to the artifacts and a file per hour
to the records. One log per route answers the same question with one file per route.

**A revision history inside the document.** Every published version kept in the document itself.
It inflates the one thing that gets read on every publish, and it stores drafts that were never
live beside states that were — which is exactly the distinction rollback depends on.
