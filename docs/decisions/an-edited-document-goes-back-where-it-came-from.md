---
title: An edited document goes back where it came from
summary: Why the config supplies an optional save beside document, and why a write verb compiles before it persists
status: stable
---

# An edited document goes back where it came from

A consumer's config supplies `document(route)` to read and an optional `save(route, version)` to
write. The write verbs — `add`, `remove`, `move`, `set` — load through the first, apply one of
`core`'s operations, compile the result, and persist through the second. Where a document lives
stays the consumer's business: a file, a database, a draft API, an object store behind a hook
they write.

Where `save` is absent the write verbs refuse and name the config. Everything else keeps working,
so a consumer who only publishes fixtures carries nothing they do not use.

## What forced it

`core`'s operations are pure: `addNode(version, parentId, slot, node, index?)` returns a new
`DocumentVersion` and touches nothing. That is invariant 5 — `core` computes, adapters do IO —
and it is why the same functions serve a terminal, a CI job and a browser studio.

It leaves the CLI holding a document with nowhere to put it. `document` is a loader; running
`set` would apply the change in memory, print something reassuring, and lose it — the next
command would read the original back. An edit that does not persist is not an edit.

## Compile before persisting

Each write verb compiles the document it produced and refuses to save one that cannot compile.
`core` permits an illegal intermediate on purpose, because two edits can pass through one and end
legal. A command is one edit, so the state it leaves behind is the state a person or a script
sees next, and a stored document that cannot publish fails later and further away.

There is no `--force`. A genuine multi-step edit is a script calling `core`'s operations directly
and saving once — which is what the operations being pure functions is *for*, and what the
demo's own capture config does with two `moveNode` calls in a row.

## A new node starts from the catalog's defaults

`add` seeds the node it creates with the block's `defaults`, which follows from compiling before
persisting rather than from taste. A block with a required field and empty props cannot compile,
so an `add` that seeded nothing would be refused every time, and no order of `add` then `set`
would ever be legal — the two commands would have no sequence a person could run.

`defaults` is already what a freshly dropped block renders with, and already required to satisfy
its own schema, so the seed is the one value in the system that is guaranteed to compile.

## A field resolved per request cannot be set

`set` refuses a path carrying a `data` hint. The value would be written, stored, compiled into a
hole, and then replaced at request time by the resolver — a write that is never wrong and never
visible. Refusing by name is the only outcome that tells the truth.

## What it beat

**A store interface in `core` for documents.** The authoring store is genuinely undecided, and
deciding it here — in the package furthest from where a document lives — is how a contract gets
set by whichever caller needed it first. `save` is deliberately a hook on a config rather than an
interface with a name, so replacing it later costs a consumer one function.

**Editing and publishing in one shot, persisting nothing.** `set … --publish` would work once and
lie afterwards: the document on disk still holds the old value, so the next publish silently
reverts the edit.

**Writing through the artifact store.** It already exists, and it is the wrong shape: it holds
compiled, immutable, content-addressed artifacts. A document is none of those things, and an
authoring history is not a publishing history.
