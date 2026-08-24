---
title: Compiling a Document
summary: compile and the document operations as shipped — the document shape, the two validation passes, and every issue code Nubbin can raise
status: reference
---

# Compiling a document

This page holds the reasoning: why validation runs in two passes, what each issue code means,
and when an author sees one. Every signature, parameter and type member is generated from the
source into [the API reference](generated/README.md), which is where to read the surface
itself. Why compiling happens at publish, and why it is validation rather than a build, is
[Why compile at publish](../architecture.md#why-compile-at-publish).

## `compile`

[`compile`](generated/core/functions/compile.md) validates one document version and
serializes it into an [`Artifact`](artifacts.md#artifact), returned beside the issues that did
not stop one existing. A fault raises `NubbinError`; an `unknown-prop` is reported rather than
raised, so a document carrying one still compiles and the caller decides what to do about it.
It performs no IO — reading the document and writing the artifact belong to adapters.

Validation runs in two passes, and the second runs only if the first found nothing —
prop validation over a document with dangling references would bury the real cause in
cascading noise:

1. **Structure.** Every node names a registered block, every referenced child id exists, the
   graph reaches every element from some entry in `roots` without cycles, and every filled
   slot is declared, within its `min`/`max` bounds, and holds only blocks its `allow` list
   admits.
2. **Props.** Every node's props are validated by its catalog entry's schema — the schema's
   own `~standard.validate`, never a projection — and the parsed output is what the artifact
   keeps. A node whose block has no catalog entry is an issue here too.

Derived from `packages/core/src/compile.test.ts`:

```ts
import { compile, createRegistry, defineBlock, defineCatalog } from "@nubbin/core";
import type { DocumentVersion } from "@nubbin/core";
import { z } from "zod";

const heroSchema = z.object({ title: z.string(), price: z.number() });
const cardSchema = z.object({ label: z.string() });

const hero = defineBlock({
  name: "Hero",
  schema: heroSchema,
  component: null,
  version: 1,
  slots: { items: { allow: ["Card"], max: 2 } },
});
const card = defineBlock({
  name: "Card",
  schema: cardSchema,
  component: null,
  version: 1,
  slots: {},
});

const registry = createRegistry([hero, card]);
const catalog = defineCatalog({
  Hero: { schema: heroSchema, ui: { fields: { price: { data: { revalidate: 60 } } } } },
  Card: { schema: cardSchema },
});

const version: DocumentVersion = {
  documentId: "d1",
  version: 1,
  roots: ["n1"],
  elements: {
    n1: { id: "n1", block: "Hero", props: { title: "T", price: 10 }, slots: { items: ["n2"] } },
    n2: { id: "n2", block: "Card", props: { label: "L" } },
  },
  meta: { title: "Summer promotion" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "docs",
};

const { artifact } = compile(version, catalog, registry, "/dispatches");

artifact.tree[0]?.props; // { title: "T" }  — static fields, frozen
artifact.tree[0]?.holes; // { price: { revalidate: 60 } }  — resolved at render instead
artifact.blockVersions; // { Hero: 1, Card: 1 }
```

Compiling the same document against the same catalog and registry yields the same `hash` every
time — the artifact is content-addressed, with key order normalized before hashing so insertion
order cannot change the address.

## Holes: what a `data` hint compiles to

After validation, each node's parsed props are split by the catalog's
[`data` hints](catalog.md#fieldhintdata). A field with no hint freezes into
`ArtifactNode.props`; a field carrying a `{ revalidate }` hint is dropped from props and
recorded in `ArtifactNode.holes` under the path its hint names, carrying the hint as the
instruction for render time. The split is by that whole dotted path: a hint on `cta.label`
takes that leaf alone and the rest of `cta` stays frozen, which is why a hole's key is a path
and not a field name — see
[A `data` hint addresses a path, not a top-level key](../decisions/a-data-hint-addresses-a-path-not-a-top-level-key.md).

## Why the authoring shape is flat

[`DocumentVersion`](generated/core/interfaces/DocumentVersion.md) indexes every
[`Node`](generated/core/interfaces/Node.md) by id, and a node's `slots` hold ordered
child ids rather than nested nodes, so every editor operation addresses a node directly.
Compiling denormalizes it into the artifact's nested tree — the trade is
[Flat while authoring, nested once published](../decisions/flat-while-authoring-nested-once-published.md).

`roots` lists entry elements in order, and `Artifact.tree` holds one denormalized tree for
each — see [A document has many roots](../decisions/a-document-has-many-roots.md).

How a `DocumentVersion` is stored is the authoring store, an open design question of its own — so the examples here construct one as a
literal, the way the package's own tests do. Editing one is
[`setNodeProp`](#setnodeprop-and-setatpath); composing one is
[`addNode`, `removeNode` and `moveNode`](#addnode-removenode-and-movenode).

## `setNodeProp` and `setAtPath`

[`setNodeProp`](generated/core/functions/setNodeProp.md) is the first document
operation: a new `DocumentVersion` with one prop set on one node, copy-on-write, every
untouched node kept by reference. It lives beside `compile`
rather than inside an editor, so every caller — a studio, a script, an agent —
[writes a document through one definition of the write](../decisions/document-operations-live-in-core-beside-compile.md).

Three deliberate absences. It does not validate the value — that is `compile`'s job at the
next compile, which reports an `invalid-props` issue at the offending path. It does not bump
`version` — appending a version belongs to the authoring store, not to one edit. And it throws on an
unknown `nodeId` and on an `items[]` path, which names every array member rather than one.

[`setAtPath`](generated/core/functions/setAtPath.md) is the copy-on-write descent it
writes with — the same one the renderer uses to fill a resolved hole value into props at
render time.

## `addNode`, `removeNode` and `moveNode`

[`addNode`](generated/core/functions/addNode.md),
[`removeNode`](generated/core/functions/removeNode.md) and
[`moveNode`](generated/core/functions/moveNode.md) compose structure, on the same
terms as `setNodeProp`: a new `DocumentVersion`, copy-on-write, every untouched node kept by
reference, and no bump to `version`. `index` inserts and its absence appends; for `moveNode`
it names a position in the target slot *after* the node is taken out, which is the reading
under which moving something to the end is the slot's length.

**The caller supplies `node.id`.** `core` runs in a browser, a worker and a build step, so it
reaches no `node:` builtin — and a generator inside these functions would make the same
composition produce a different document each time, which
[content addressing](artifacts.md) cannot tolerate. `crypto.randomUUID()` belongs in the
caller. `addNode` refuses an id the document already holds, because reusing one would replace
a node and silently redirect every slot that named it.

**They do not judge legality.** A block a slot's `allow` forbids, a slot pushed past `max` or
emptied below `min`, a move into the node's own subtree — `compile` refuses each by name, so
judging it here would be a second opinion on one question. It also lets a document be illegal
between two edits that end legal, which any editing session needs.

**`removeNode` cascades.** Removing a section removes what was in it. Children left behind
are unreachable, which `compile` already refuses, so the alternative is a document that
cannot compile until an author deletes each orphan by hand.

Each throws on a `nodeId` or `parentId` the document does not hold.

## `NubbinError`, `NubbinIssue` and `NubbinIssueCode`

[`NubbinError`](generated/core/classes/NubbinError.md) is one class for every refusal
the packages raise, so a consumer writes one `catch` and ships one shape to whatever tooling
they keep. Nubbin never logs and never decides what a refusal means —
it hands back the code and the prose, and the caller chooses.

`code` is on the error directly because every surface but `compile` raises exactly one issue;
`compile` collects, so an author fixing six problems sees six, and its `code` is the first.

```ts
import { NubbinError, NubbinIssueCode } from "@nubbin/core";

try {
  const { artifact, issues } = compile(version, catalog, registry, "/dispatches");
  for (const issue of issues) {
    // Not fatal — an artifact exists. Log it, ship it, or ignore it.
    logger.warn({ code: issue.code, at: issue.at, path: issue.path, message: issue.message });
  }
} catch (error) {
  if (error instanceof NubbinError && error.code === NubbinIssueCode.InvalidProps) {
    // …
  }
}
```

A [`NubbinIssue`](generated/core/interfaces/NubbinIssue.md) carries `at` and `path` as
two coordinates rather than one string, so an editing surface can select the node and highlight
the field without parsing a message.

### Every code

[`NubbinIssueCode`](generated/core/type-aliases/NubbinIssueCode.md) is a closed set. A
member's value is its own name in kebab-case, so a serialized issue reads the same in a log as
in code.

**Registration** — raised by `defineBlock`, `defineCatalog` and `createRegistry`, at the point a
developer's own code registers something unusable.

| Member | Value | Raised when |
|---|---|---|
| `BlockVersion` | `block-version` | A block's `version` is not an integer of 1 or more |
| `SlotBounds` | `slot-bounds` | A slot's `min` exceeds its `max`, which no composition satisfies |
| `SlotAllowUnknown` | `slot-allow-unknown` | An `allow` entry names no registered block |
| `DuplicateBlockName` | `duplicate-block-name` | Two blocks claim one name, which nodes resolve through |
| `InvalidDefaults` | `invalid-defaults` | `defaults` do not satisfy the entry's own schema |
| `HintPathUnresolvable` | `hint-path-unresolvable` | `ui.fields` names a path the schema does not define |
| `HintNotAddressable` | `hint-not-addressable` | A `data` hint names an array member, or two hints overlap |

**Schema** — the validator a consumer brought does not answer the door `core` reads through.

| Member | Value | Raised when |
|---|---|---|
| `NotStandardSchema` | `not-standard-schema` | No `~standard.validate`, or it validates asynchronously |
| `NoJsonSchema` | `no-json-schema` | No Standard JSON Schema converter, which introspection needs |

**Structure** — `compile`'s first pass, over the document's graph. Every one is collected.

| Member | Value | Raised when |
|---|---|---|
| `NoRoots` | `no-roots` | The document names no entry element |
| `UnknownBlock` | `unknown-block` | A node names a block the registry or catalog lacks |
| `DanglingChild` | `dangling-child` | A slot or `roots` entry references an id with no element |
| `Cycle` | `cycle` | A node reaches back to an ancestor, so the graph cannot flatten |
| `Unreachable` | `unreachable` | No slot reaches the node from any root |
| `SlotNotAllowed` | `slot-not-allowed` | A slot the block never declared, or a child its `allow` rejects |
| `SlotMin` | `slot-min` | A slot holds fewer children than its `min`; an omitted slot holds zero |
| `SlotMax` | `slot-max` | A slot holds more children than its `max` |

**Props** — `compile`'s second pass, over each node's values.

| Member | Value | Raised when |
|---|---|---|
| `InvalidProps` | `invalid-props` | `validate()` returned issues, or parsed to something other than an object |
| `UnknownProp` | `unknown-prop` | **Returned, never thrown.** A key the schema did not keep — see below |

**Document operations** — the caller named something the document does not hold.

| Member | Value | Raised when |
|---|---|---|
| `NoSuchNode` | `no-such-node` | A node id no element backs |
| `DuplicateNodeId` | `duplicate-node-id` | `addNode` was given an id the document already uses |
| `PathNotAddressable` | `path-not-addressable` | An empty segment, an `[]`, or a descent into an array |
| `InvalidRoute` | `invalid-route` | A route no request could match |

**Render** — `@nubbin/react`, where the artifact and the registry serving it disagree.

| Member | Value | Raised when |
|---|---|---|
| `BlockNotLoaded` | `block-not-loaded` | The registry has no importer for a block the artifact names |
| `NoHoleResolver` | `no-hole-resolver` | A node declares holes and no `resolveHole` was given |
| `NotOneHostElement` | `not-one-host-element` | A block returned a Fragment, a composite, or several roots |

**Store** — a write the store cannot honour.

| Member | Value | Raised when |
|---|---|---|
| `ArtifactNotStored` | `artifact-not-stored` | A publish names a hash the store does not hold |

### The one that does not throw

`unknown-prop` is returned in `CompileResult.issues` rather than thrown, because the split is
not severity — it is whether an artifact exists. A key the schema did not declare still yields a
valid, publishable artifact, so refusing one would reject a page that renders perfectly.

A schema reshapes as well as validates: a `.default()` adds a key, a coercion or a transform
changes a value, and neither is a loss. What is a loss is a key that went in and did not come
out, which is almost always a typo — `heading` where the schema says `headline`. Before this was
reported it vanished in silence, the artifact compiled, and the page served with the default.

It does not change the content address. Two documents differing only by a key the schema never
kept compile to the same artifact, because they render identically.
