---
title: The Command Line
summary: The @nubbin/cli surface as shipped — the config file it resolves, the commands, and what each exit code means
status: reference
---

# The command line

This page describes the shipped surface of `@nubbin/cli`: the config a consumer writes, the
commands, and the codes the process exits with. Why the publish path ships as a
command line at all, and what this package is not allowed to decide, is
[its own decision](../../decisions/publishing-has-a-driver-that-is-not-an-editor.md).

The package installs a `nubbin` executable and exports `defineConfig`. Nothing else in the
repository imports it.

## `defineConfig`

[`defineConfig`](../generated/cli/functions/defineConfig.md) is identity at runtime. It
exists so a config file is checked against
[`NubbinConfig`](../generated/cli/interfaces/NubbinConfig.md) as it is written, rather than
at the moment a publish fails.

**`registry` is the compile-side one** — blocks with their schemas, and the source of the
version an artifact records for each block it uses. A render-side registry has no schemas and
cannot be substituted here.

**`document` is a function, not a table.** Where documents live belongs to the consumer: a
directory of fixtures, a database, a draft API. A table is a one-line adapter over a function and
the reverse is not true. Returning `null` says the route has no document, which is reported
rather than guessed at.

**`save` is `document` in the other direction, and optional.** It is where the write verbs put an
edited document, and a config without one refuses them while everything else keeps working. Why
it is a hook on the config rather than a store interface in `core` is argued in
[an edited document goes back where it came
from](../../decisions/an-edited-document-goes-back-where-it-came-from.md).

## Finding the config

`nubbin.config.ts` — or `.js` — is searched for from the working directory upward, stopping at
the repository root: the nearest directory carrying a `.git` entry, which a linked worktree has
as a file and an ordinary checkout as a directory. The nearest config wins, so an application's
beats the repository's, and the climb never crosses the root — a config above the repository
belongs to some other project. A checkout with no `.git` anywhere — a tarball, a vendored copy,
a Docker build context — offers no boundary to trust, so only the working directory is searched
and the refusal says to name anything further away with `--config`.

`--config <path>` names one instead, and a named path that is not there is an error rather than
the start of a search.

The file is imported through [jiti](https://github.com/unjs/jiti). A config that lives beside an
application imports the way that application does — extensionless specifiers, path aliases,
TypeScript throughout — and none of that resolves under bare Node.

A block definition carries its component beside its schema, so reaching a registry means loading
`.tsx` files. JSX inside a component's body is parsed and never evaluated — the call it compiles
to is reached by rendering, which no command does — so **React need not be installed**, which is
what keeps `check` runnable in a CI job that installs nothing but the CLI.

Two things break that, and both fail loudly rather than silently: a module that *evaluates* JSX at
module scope, and a module that imports React at module scope. The first raises `React is not
defined` even where React is installed, because the transform emits `React.createElement` and adds
no import; the second needs React resolvable like any other dependency.

Both fail loudly on purpose. The loader could point the transform at a shim and let module-scope
JSX evaluate to nothing, which would make React optional everywhere — and would quietly freeze a
`null` into an artifact where a block's `defaults` held an element. A refusal that names the file
is the better failure.

## The commands

| Command | Effect |
|---|---|
| `compile <route>` | compiles and reports the hash the route would publish as. Writes nothing |
| `publish <route>` | compiles, writes the artifact, then moves the pointer |
| `unpublish <route>` | drops the pointer. The artifact stays readable |
| `rollback <route> <hash>` | checks an artifact already in the store against the registry, then points the route at it. `--to <version>` names a document version instead, resolved through the history |
| `history <route>` | what the route has pointed at, newest first, with the document version and time of each move |
| `show <route>` | the document as authored — every id, the block it holds, and the slot it sits in. Compiles nothing, so a document the registry would refuse still shows its ids |
| `add <route> <block>` | mint a node into a parent's slot, seeded from the block's catalog `defaults`, and print the id it minted |
| `remove <route> <id>` | remove the node and everything beneath it |
| `move <route> <id>` | move the node into a parent's slot |
| `set <route> <id> <path> <value>` | set one prop on one node. The value is JSON when it parses as any, and the string as given otherwise |
| `status [route]` | what is live, everywhere or at one route |
| `check` | every live route against the registry as it is now |
| `help` | the usage text, on stdout and exiting `0` — asking for it succeeds |

A command refuses an argument it does not read. `check` takes no route; `--origin` is refused
by `compile`, `status` and `check` — none of them moves a pointer, so `status --origin http://prod`
would answer from the local store while looking like it asked the server — and `--to` is refused
by everything but `rollback`, the one command that resolves a document version through history.
The placement flags — `--parent`, `--slot`, `--index` — belong to `add` and `move`, the two
commands that place a node in a slot, and are refused everywhere else the same way.

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

`rollback /pricing --to 3` names the document version instead of the hash, resolved through the
same history `history` lists — the latest move of that version wins, since a version published
twice was last live as its later move. Given both a hash and `--to`, the command refuses rather
than guessing which was meant.

### The write verbs

`add`, `remove`, `move` and `set` address nodes by the ids `show` prints, apply one of `core`'s
document operations, and put the result back through the config's `save` — a config without one
refuses them and names it. The whole shape is
[an edited document goes back where it came
from](../../decisions/an-edited-document-goes-back-where-it-came-from.md); what a command adds to
the operation it wraps:

- **`add` mints the id** with `crypto.randomUUID()` and prints it after the arrow, so
  `nubbin add … | grep -o '[^ ]*$'` captures the argument every later command takes. `core`
  deliberately mints nothing —
  [the caller supplies `node.id`](compile.md#addnode-removenode-and-movenode), and this command
  is that caller. The node's props start as the block's catalog `defaults` — a block with
  required fields and empty props cannot compile, so an `add` that seeded nothing could never
  land.
- **Every verb compiles before it saves**, and refuses to save a document that cannot compile,
  printing the refusal's issue codes and exiting `1`. There is no `--force`: a command is one
  edit, and the state it leaves is what the next command — or the next publish — reads. The
  decision names what a multi-step edit is instead, and why no flag can be it.
- **`set` refuses a path carrying a `data` hint**, by name. That field resolves per request: a
  value written there would be stored, compiled into a hole, and replaced before it was served —
  a write that is never wrong and never visible.
- **`move` reads `--index` as a position in the slot as it stands after the node is taken
  out** — the only reading under which "move it to the end" is the slot's length. For both
  placing verbs, an absent `--index` appends.

### `history`

Every move `publish` made at the route, newest first, each line carrying the hash, the document
version that compiled to it, and when it went live. Unpublishing erases nothing, and only
published states appear — the model is
[A route remembers what it pointed at](../../decisions/a-route-remembers-what-it-pointed-at.md).

`history(route)` is optional on `ArtifactStore`, so a store that keeps no history is answered
with a refusal naming the gap — and `rollback --to`, which resolves through the same record,
says to name the hash instead.

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
`unpublishRoute`](../rendering/next.md#publishroute-and-unpublishroute) exist to implement.

## Exit codes

| Code | Meaning | Stream |
|---|---|---|
| `0` | it happened. Warnings may have been printed | stdout |
| `1` | refused: the document, the rollback, or a page already live | stderr |
| `2` | the command could not be run as given | stderr |

Stdout carries the answer or carries nothing, so `HASH=$(nubbin compile /pricing)` captures a hash
or captures an empty string — never a complaint about why there is no hash. A warning a compile
survived, like `unknown-prop`, goes to stderr even though the exit is `0`.

The split that matters is between `1` and `2`: a usage error means nothing was attempted, and a
refusal means what was attempted is not legal. They are fixed in different files.

A refusal prints one line per cause, each led by its
[issue code](compile.md#every-code) — `compile` collects, so an author with six problems is
shown six rather than the first.
