---
title: Artifacts, Pointers and Rollback
summary: The Artifact and ArtifactStore contracts as shipped, with the compatibility and rollback checks
status: reference
---

# Artifacts, pointers and rollback

This page holds the reasoning behind the output layer of `@nubbin/core`: what an artifact
guarantees, what an `ArtifactStore` implementation owes its callers, and how the compatibility
and rollback checks read drift. The declarations themselves — every member, parameter, return
and throw — are generated from the source that defines them, in
[the generated reference](generated/@nubbin/core/README.md), and nothing here repeats one. Why
artifacts are immutable and addressed by content is
[Artifacts are immutable and content-addressed](../decisions/artifacts-are-immutable-and-content-addressed.md);
what they may contain is
[Artifacts contain data, never code](../decisions/artifacts-contain-data-never-code.md).

## `Artifact`

An [`Artifact`](generated/@nubbin/core/interfaces/Artifact.md) is one document version compiled
for one route, and its hash is its identity rather than a checksum carried beside it. The
address is computed over every other field — the tree, the metadata, the route, the recorded
block versions and the compiling `@nubbin/core` version — with object keys sorted first, so two
compiles of the same content land at the same address whatever order they happened to build it
in. Nothing sits outside the address, so a change anywhere is a different artifact rather than
the same one edited.

`blockVersions` records the blocks the document uses and no others. A route loads what its
artifact lists, so naming unused blocks would load them too — and every name recorded there is
a name [`checkRollback`](#checkrollback) later holds the registry to.

## `ArtifactNode` and `Holes`

An [`ArtifactNode`](generated/@nubbin/core/interfaces/ArtifactNode.md) is fully resolved:
`slots` hold nested nodes rather than ids, so rendering needs no lookups and no dangling
reference is possible. `props` hold only frozen literal values; each entry in
[`Holes`](generated/@nubbin/core/type-aliases/Holes.md) records a field the renderer resolves
instead, keyed by schema path and carrying the
[`FieldHintData`](generated/@nubbin/core/type-aliases/FieldHintData.md) that says how — see
[Holes: what a `data` hint compiles to](compile.md#holes-what-a-data-hint-compiles-to). How a
hole's value is sourced at render is per-adapter. The authorization model for connecting a
field to a data source remains open.

## `checkRollback`

[`checkRollback`](generated/@nubbin/core/functions/checkRollback.md) compares what the artifact
was compiled against — its `blockVersions` — with the registry live now, before a pointer is
moved back to it. It returns rather than throws: the caller decides whether drift blocks the
rollback. The model is [Rollback](../domain-model.md#rollback).

Derived from `packages/core/src/checkRollback.test.ts`:

```ts
import { checkRollback, createRegistry, defineBlock } from "@nubbin/core";
import type { Artifact } from "@nubbin/core";
import { z } from "zod";

const heroAtV2 = defineBlock({
  name: "Hero",
  schema: z.object({ title: z.string() }),
  component: null,
  version: 2,
  slots: {},
});

const artifact: Artifact = {
  hash: "h",
  route: "/dispatches",
  documentId: "promotions-summer",
  documentVersion: 1,
  blockVersions: { Hero: 1 },
  tree: [],
  meta: { title: "Summer promotion" },
  compiledWith: "0.0.0",
};

checkRollback(artifact, createRegistry([heroAtV2]));
// { compatible: false, drifted: ["Hero"] }
```

`drifted` names every block whose registered version differs from the recorded one — and a
block the registry no longer holds at all counts as drift, because a deleted block is exactly
the failure a rollback must be warned about.

## `checkCompatibility`

[`checkCompatibility`](generated/@nubbin/core/functions/checkCompatibility.md) runs the same
comparison over every pointer instead of one artifact, and reports it with the version delta a
reader needs to act: which route, which artifact, which block, what the page was compiled
against, and what is registered now. A block the registry has lost reads as `registered: null`.
A pointer whose hash the store cannot resolve is incompatible on its own, since that route is
broken with no registry change involved.

It takes the pointers and artifacts rather than the store, because passing an `ArtifactStore`
would put IO inside the package whose portability is the point, and would exclude any consumer
whose live state does not sit behind that interface. Reading is three lines and belongs to the
caller:

```ts
const { routes } = await store.manifest();
const live = await Promise.all(
  routes.map(async (pointer) => ({ pointer, artifact: await store.read(pointer.hash) })),
);
const report = checkCompatibility(live, registry);
```

`checked` is on the report because a run that read no pointers is compatible with everything.
A caller asserts on it before trusting the verdict, or a store the check never reached reads as
a pass.

## `formatCompatibilityReport`

[`formatCompatibilityReport`](generated/@nubbin/core/functions/formatCompatibilityReport.md)
renders the report as a log reads it, leading with the count in both directions:

```
2 of 8 live route pointer(s) are incompatible with this registry:
  /  (artifact 4a162726)
    Hero: page needs v1, registry has v2
    CardGrid: page needs v1, no longer in the registry
  /about  (artifact 8be9f4fd)
    Hero: page needs v1, registry has v2
```

## `ArtifactStore`

[`ArtifactStore`](generated/@nubbin/core/interfaces/ArtifactStore.md) is the output layer's
whole IO surface. `core` only returns values for it; adapters implement it — `@nubbin/store-fs`
is the reference implementation, and every implementation is proven against one shared suite,
`packages/store-fs/src/testing/runArtifactStoreContract.ts`. The behaviour that suite pins:

| Guarantee | Meaning |
|---|---|
| `read` of an unknown hash is `null` | Absence is a value, never a throw |
| `write` of an already-stored hash is a no-op | Artifacts are content-addressed, so rewriting identical content changes nothing |
| `publish` parses `matchKind` from the route | Via [`parseMatchKind`](#parsematchkind) — callers never supply it |
| `publish` of a hash that was never written rejects | No pointer may dangle |
| `publish` of the same route and hash twice is a no-op | Republishing is safe |
| `unpublish` removes the pointer and keeps the artifact | Unpublishing takes a route offline; it destroys nothing, and a missing pointer is tolerated |
| `history`, where implemented, lists the route's moves oldest first | Only published states appear; `unpublish` erases none of it; republishing the same hash records a second move — content addressing dedupes artifacts, not moves |

The ordering is the caller's to keep: write the artifact, then point the route at its hash. A
pointer published at a hash nothing was written for is a live 404, which is why an
implementation rejects one rather than storing it.

Publishing never mutates an artifact — it writes a new one and moves the route's pointer,
which is what makes cache invalidation at the store unnecessary.

## `RoutePointer` and `Manifest`

The [pointer](generated/@nubbin/core/interfaces/RoutePointer.md) is the single piece of
output-layer state that changes in place — each route owns its own record, naming the artifact
currently live there. Why per-route pointers beat one mutable manifest is
[Route pointer](../domain-model.md#route-pointer).
[`Manifest`](generated/@nubbin/core/interfaces/Manifest.md) is the advisory aggregation over
every pointer — a route list for an editing surface or CI, derived rather than authoritative.

## `PointerMove`

A [`PointerMove`](generated/@nubbin/core/interfaces/PointerMove.md) is one `publish` at a route,
as the optional `history(route)` hands it back. `history` is optional because a write-only blob
store is still a valid adapter — a caller that needs it degrades with a message rather than
assuming it. Why the record lives beside the pointer instead of inside it, and is appended
rather than rewritten, is
[A route remembers what it pointed at](../decisions/a-route-remembers-what-it-pointed-at.md).

## `parseMatchKind`

[`parseMatchKind`](generated/@nubbin/core/functions/parseMatchKind.md) derives a pointer's
`matchKind` from its route. It lives in `core` so every adapter shares one implementation — a
second parser is free to disagree. It judges the route before classifying it, and that is the
last point before a pointer is written: an adapter that never called `compile` still cannot
publish an unaddressable route.
