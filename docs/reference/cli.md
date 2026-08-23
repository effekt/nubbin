---
title: The Command Line
summary: The @nubbin/cli surface as shipped — the config file it resolves, the six commands, and what each exit code means
status: reference
---

# The command line

This page describes the shipped surface of `@nubbin/cli`: the config a consumer writes, the six
commands that read it, and the codes the process exits with. It drives the same functions an
editor would call, which is what makes a terminal, a CI job and a studio three callers of one
contract rather than three implementations of one behaviour.

The package installs a `nubbin` executable and exports `defineConfig`. Nothing else in the
repository imports it.

## `defineConfig`

```ts
function defineConfig(config: NubbinConfig): NubbinConfig
```

Identity at runtime. It exists so a config file is checked as it is written rather than at the
moment a publish fails.

```ts
interface NubbinConfig {
  catalog: Catalog;
  registry: Registry;
  store: ArtifactStore;
  document: (route: string) => DocumentVersion | null | Promise<DocumentVersion | null>;
}
```

**`registry` is the compile-side one** — blocks with their schemas, whose fingerprint an artifact
records. A render-side registry has no schemas and cannot be substituted here.

**`document` is a function, not a table.** Where documents live belongs to the consumer: a
directory of fixtures, a database, a draft API. A table is a one-line adapter over a function and
the reverse is not true. Returning `null` says the route has no document, which is reported
rather than guessed at.

## Finding the config

`nubbin.config.ts` — or `.js` — is searched for from the working directory upward, stopping at
the repository root. The nearest one wins, so an application's config beats the repository's.
`--config <path>` names one instead, and a named path that is not there is an error rather than
the start of a search.

The file is imported through [jiti](https://github.com/unjs/jiti). A config that lives beside an
application imports the way that application does — extensionless specifiers, path aliases,
TypeScript throughout — and none of that resolves under bare Node.

## The commands

| Command | Effect |
|---|---|
| `compile <route>` | compiles and reports the hash the route would publish as. Writes nothing |
| `publish <route>` | compiles, writes the artifact, then moves the pointer |
| `unpublish <route>` | drops the pointer. The artifact stays readable |
| `rollback <route> <hash>` | checks an artifact already in the store against the registry, then points the route at it |
| `status [route]` | what is live, everywhere or at one route |
| `check` | every live route against the registry as it is now |

### `publish`

Write, then point. A pointer at a hash nothing has written is a live 404; an artifact nothing
points at is invisible and harmless.

Legality is only knowable by compiling, so `publish` runs the same path `compile` does. A route
that compiled cleanly and then failed to publish failed in the store, not in the document.

### `rollback`

The artifact is read by hash and refused if it belongs to another route. `checkRollback` then
compares what it was compiled against with the registry as it stands: an older artifact whose
blocks have moved on cannot render, so the pointer does not move and the drifted block names are
printed.

### `check`

Reads every pointer, reads each artifact, and runs `checkCompatibility` over the pair. It
compiles nothing and writes nothing, and it exits non-zero when a page that is live depends on a
block that changed version or left the registry — which is what makes it a required check on a
pull request rather than a report someone reads.

## Publishing through a running application

A page cache is invalidated by the process that serves it. Moving a pointer from a terminal while
a server is up leaves that server answering from its cache, and the store and the site disagree
until it restarts.

`--origin <url>` posts to the application instead, at `/api/nubbin/publish` and
`/api/nubbin/unpublish` — the two handlers [`publishRoute` and
`unpublishRoute`](next.md#publishroute-and-unpublishroute) exist to implement.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | it happened. Warnings may have been printed |
| `1` | refused: the document, the rollback, or a page already live |
| `2` | the command could not be run as given |

The split that matters is between `1` and `2`: a usage error means nothing was attempted, and a
refusal means what was attempted is not legal. They are fixed in different files.

A refusal prints one line per cause, each led by its
[issue code](compile.md#every-code) — `compile` collects, so an author with six problems is
shown six rather than the first.
