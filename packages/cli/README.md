# @nubbin/cli

The publish path from a terminal. Compile a document, write the artifact, move the route
pointer, and ask whether anything already live still fits the blocks in your code — with no
editor running and no React loaded.

```bash
npm install -D @nubbin/cli
```

## The config

One file beside the application it configures, found by climbing from where the command ran:

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
});
```

`document` is a function rather than a table because where documents live is yours: a directory
of fixtures, a database, an API. Returning `null` says the route has none, which is reported
rather than guessed at.

The file is loaded through [jiti](https://github.com/unjs/jiti), so it may import the way the
rest of your application does — extensionless specifiers, path aliases, TypeScript throughout.

## The commands

```bash
nubbin compile /pricing              # would it publish, and as what hash — writes nothing
nubbin publish /pricing              # compile, write the artifact, then move the pointer
nubbin unpublish /pricing            # drop the pointer; the artifact stays where it is
nubbin rollback /pricing 9f2c1a…     # point the route back at an artifact already stored
nubbin status                        # every live route, or one of them
nubbin check                         # every live route against the registry as it is now
```

`--config <path>` names a config instead of searching for one.

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
a script branches on the same names your editor would. Stdout carries the answer or nothing:
`HASH=$(nubbin compile /pricing)` captures a hash, never a complaint about why there is not one.

## In CI

`nubbin check` reads every route pointer, compares each artifact against the registry it was
compiled with, and exits `1` when a page that is live depends on a block that changed version or
left the registry. That makes it a required check on a pull request, not a report someone reads.
