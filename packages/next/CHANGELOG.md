# @nubbin/next

## [0.1.1](https://github.com/effekt/nubbin/compare/next-v0.1.0...next-v0.1.1) (2026-08-24)


### Miscellaneous Chores

* **next:** Synchronize nubbin versions

## [0.1.0](https://github.com/effekt/nubbin/compare/next-v0.1.0-rc.7...next-v0.1.0) (2026-08-24)


### Bug Fixes

* **cli:** stdout carries the answer, and --origin is taken as given ([a2d8ff3](https://github.com/effekt/nubbin/commit/a2d8ff36e3ca8663b5fb296d159d63d7cf3f0cb0))


### Miscellaneous Chores

* **repo:** cut 0.1.0 rather than another candidate ([0a9e869](https://github.com/effekt/nubbin/commit/0a9e8694eaeec79fd534ed2a6a00b346d843e4ca))

## [0.1.0-rc.7](https://github.com/effekt/nubbin/compare/next-v0.1.0-rc.6...next-v0.1.0-rc.7) (2026-08-23)


### ⚠ BREAKING CHANGES

* **core:** `CompileError`, `CompileIssue` and `CompileIssueCode` are replaced by `NubbinError`, `NubbinIssue` and `NubbinIssueCode`. `issue.nodeId` is now `issue.at`. `compile` returns `{ artifact, issues }` rather than an artifact.
* **core:** `Artifact.registryFingerprint`, `Registry.fingerprint()`, `BlockDocs`, `CatalogEntry.docs`, `Block.status`, `FieldHint.label`, `FieldHint.control` and the `"request"` member of `FieldHintData` are removed. Every artifact re-addresses, so a store written before this must be republished.
* `hashArtifact` and `Registry.fingerprint()` return sixteen hex characters where they returned eight. Every stored artifact re-addresses, so a store written before this must be republished from its documents.

### Features

* **core:** one error surface, every refusal keyed by a code ([c9d74c7](https://github.com/effekt/nubbin/commit/c9d74c7816fb35f6607b8e57bdd4c25fd03aa2ca))


### Bug Fixes

* widen the content address, and make the demo build and serve ([c47993d](https://github.com/effekt/nubbin/commit/c47993d15bb09ddfb4baf5bc26a0a25293463244))


### Code Refactoring

* **core:** remove the published surface nothing reads ([8777c70](https://github.com/effekt/nubbin/commit/8777c70acdc6a9e837a7972d577e4b860031195e))

## [0.1.0-rc.6](https://github.com/effekt/nubbin/compare/next-v0.1.0-rc.5...next-v0.1.0-rc.6) (2026-08-19)


### Miscellaneous Chores

* **next:** Synchronize nubbin versions

## [0.1.0-rc.5](https://github.com/effekt/nubbin/compare/next-v0.1.0-rc.4...next-v0.1.0-rc.5) (2026-08-19)


### Features

* **repo:** a generated catalog answers "does this already exist" ([2d41486](https://github.com/effekt/nubbin/commit/2d414864667d41aa7ce2e055c540c3ceb5491364))

## 0.1.0-rc.4

### Patch Changes

- Updated dependencies [97144e9]
- Updated dependencies [dd9c3b3]
  - @nubbin/core@0.1.0-rc.4

## 0.1.0-rc.3

### Patch Changes

- b19d23e: Every package now carries a README, a licence and repository metadata. Their npm pages showed
  "ERROR: No README data found!", and three of the four declared no licence at all on an MIT
  project.
- Updated dependencies [8a01bab]
- Updated dependencies [3495902]
- Updated dependencies [cb596fa]
- Updated dependencies [d42f112]
- Updated dependencies [3c65495]
- Updated dependencies [b19d23e]
  - @nubbin/core@0.1.0-rc.3

## 0.1.0-rc.2

### Patch Changes

- 13a978a: The package can now be imported outside a bundler. It imported `next/cache`, a bare subpath
  that resolves only through a bundler — Next ships no `exports` map and ESM does not do
  extension resolution, so plain Node failed at import with `ERR_MODULE_NOT_FOUND`. Because the
  package entry re-exports everything, that took the read-path functions down with it. The
  specifier is now `next/cache.js`, which resolves both ways.
- Updated dependencies [a875486]
- Updated dependencies [37e20c6]
- Updated dependencies [337fcba]
- Updated dependencies [0672a37]
  - @nubbin/core@0.1.0-rc.2

## 0.1.0-rc.1

### Minor Changes

- 577550f: The storage and binding halves of the render path.
  
  `@nubbin/store-fs` is a pointer-per-route artifact store, proven against a contract suite any
  adapter can run. `@nubbin/next` resolves an artifact through one pointer read, prebuilds exact
  routes, and publishes or unpublishes a single route with the invalidation that makes an
  unpublish a served 404. `@nubbin/react` resolves declared holes. `@nubbin/core` gains
  `parseMatchKind`, so no adapter derives a route's match kind itself, and `InferProps`.

### Patch Changes

- Updated dependencies [577550f]
  - @nubbin/core@0.1.0-rc.1
