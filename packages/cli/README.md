# @nubbin/cli

The publish path from a terminal. Compile a document, write the artifact, move the route
pointer, and ask whether anything already live still fits the blocks in your code — with no
editor running and no React loaded.

```bash
npm install -D @nubbin/cli
```

## The config

One file beside the application it configures, found by climbing from where the command ran —
no further than the repository root, and no climbing at all outside a repository:

```ts
// nubbin.config.ts
import { defineConfig } from "@nubbin/cli";
import { createFsArtifactStore } from "@nubbin/store-fs";
import { catalog } from "./src/nubbin/catalog";
import { registry } from "./src/nubbin/registry";
import { documents } from "./src/nubbin/documents";

export default defineConfig({
  catalog,
  registry,
  store: createFsArtifactStore("./.nubbin"),
  document: (route) => documents[route] ?? null,
  save: (route, version) => drafts.write(route, version),
});
```

`document` is a function rather than a table because where documents live is yours: a directory
of fixtures, a database, an API. Returning `null` says the route has none, which is reported
rather than guessed at.

`save` is `document` in the other direction, and optional: it is where the editing commands put
a document back. A config without one refuses those commands and keeps everything else working,
so a project that only publishes fixtures carries nothing it does not use.

The file is loaded through [jiti](https://github.com/unjs/jiti), so it may import the way the
rest of your application does — extensionless specifiers, path aliases, TypeScript throughout.

## The commands

```bash
nubbin compile /pricing                     # would it publish, and as what hash — writes nothing
nubbin publish /pricing                     # compile, write the artifact, then move the pointer
nubbin unpublish /pricing                   # drop the pointer; the artifact stays where it is
nubbin rollback /pricing 9f2c1a8e4b7d0356   # point the route back at an artifact already stored
nubbin rollback /pricing --to 3             # the same, naming the document version instead
nubbin show /pricing                        # the document as authored — ids, blocks, slots
nubbin add /pricing Card --parent grid --slot cards   # mint a node into a slot; prints its id
nubbin remove /pricing 4f9d…                # remove the node and everything beneath it
nubbin move /pricing 4f9d… --parent grid --slot cards --index 0   # move a node into a slot
nubbin set /pricing 4f9d… title Spring      # set one prop; JSON when it parses, else the string
nubbin history /pricing                     # what the route has pointed at, newest first
nubbin status                               # every live route, or one of them
nubbin check                                # every live route against the registry as it is now
nubbin help                                 # this list, as an answer rather than an error
```

`--config <path>` names a config instead of searching for one.

## Editing from the terminal

The four write verbs address nodes by the ids `nubbin show` prints. `add` mints the id itself —
`core`'s operations deliberately do not, so the same composition always produces the same
document — and prints it after the arrow, because that id is how every later command names the
node.

Each verb applies one operation, compiles the result, and persists it through `save`. A document
that cannot compile is refused with its issue codes and **nothing is saved** — there is no
`--force`, because the state one command leaves is the state the next reads. A field whose
catalog entry carries a `data` hint is refused by name: it resolves per request, so a value
written there would be compiled into a hole and replaced before anyone saw it. The reasoning
lives in [an edited document goes back where it came
from](../../docs/decisions/an-edited-document-goes-back-where-it-came-from.md).

## Publishing while the application is running

A framework's page cache is invalidated by the process that serves it. Publishing straight into
the store while a server is up moves the pointer and leaves that server answering from its cache,
so the two disagree until a restart.

`--origin <url>` publishes through the running application instead:

```bash
nubbin publish /pricing --origin http://localhost:3000
```

It posts to `/api/nubbin/publish` and `/api/nubbin/unpublish`, which are two route handlers
`@nubbin/next` provides the bodies for.

## Exit codes

| Code | Means |
|---|---|
| `0` | done — warnings may have been printed |
| `1` | refused: the document, the rollback, or a page already live |
| `2` | the command could not be run as given |

A refusal prints the code it carries — `unknown-block`, `slot-max`, `invalid-props` — on stderr, so
a script branches on the same names your editor would. Warnings go to stderr too, even when the
exit is `0`. Stdout carries the answer or nothing: `HASH=$(nubbin compile /pricing)` captures a
hash, never a warning beside it, and never a complaint about why there is not one.

## In CI

`nubbin check` reads every route pointer, compares each artifact against the registry it was
compiled with, and exits `1` when a page that is live depends on a block that changed version or
left the registry. That makes it a required check on a pull request, not a report someone reads.

Read the [Nubbin documentation](https://nubbin.io) for the complete command reference. MIT.
