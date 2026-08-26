# @nubbin/store-fs

## [0.4.1](https://github.com/effekt/nubbin/compare/store-fs-v0.4.0...store-fs-v0.4.1) (2026-08-26)


### Miscellaneous Chores

* **store-fs:** Synchronize nubbin versions

## [0.4.0](https://github.com/effekt/nubbin/compare/store-fs-v0.3.0...store-fs-v0.4.0) (2026-08-26)


### Miscellaneous Chores

* **store-fs:** Synchronize nubbin versions

## [0.3.0](https://github.com/effekt/nubbin/compare/store-fs-v0.2.0...store-fs-v0.3.0) (2026-08-26)


### Features

* **store-fs:** the contract suite is importable ([#569](https://github.com/effekt/nubbin/issues/569)) ([2f18d0c](https://github.com/effekt/nubbin/commit/2f18d0c8a292e4ddae56cb406b0405c94cc47b0e))

## [0.2.0](https://github.com/effekt/nubbin/compare/store-fs-v0.1.1...store-fs-v0.2.0) (2026-08-24)


### Features

* a route remembers what it pointed at ([#516](https://github.com/effekt/nubbin/issues/516)) ([4279f4f](https://github.com/effekt/nubbin/commit/4279f4f3c63962af9e1ac53c67ab271513ac4dbf))

## [0.1.1](https://github.com/effekt/nubbin/compare/store-fs-v0.1.0...store-fs-v0.1.1) (2026-08-24)


### Miscellaneous Chores

* **store-fs:** Synchronize nubbin versions

## [0.1.0](https://github.com/effekt/nubbin/compare/store-fs-v0.1.0-rc.7...store-fs-v0.1.0) (2026-08-24)


### Bug Fixes

* **cli:** stdout carries the answer, and --origin is taken as given ([a2d8ff3](https://github.com/effekt/nubbin/commit/a2d8ff36e3ca8663b5fb296d159d63d7cf3f0cb0))


### Miscellaneous Chores

* **repo:** cut 0.1.0 rather than another candidate ([0a9e869](https://github.com/effekt/nubbin/commit/0a9e8694eaeec79fd534ed2a6a00b346d843e4ca))

## [0.1.0-rc.7](https://github.com/effekt/nubbin/compare/store-fs-v0.1.0-rc.6...store-fs-v0.1.0-rc.7) (2026-08-23)


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

## [0.1.0-rc.6](https://github.com/effekt/nubbin/compare/store-fs-v0.1.0-rc.5...store-fs-v0.1.0-rc.6) (2026-08-19)


### Miscellaneous Chores

* **store-fs:** Synchronize nubbin versions

## [0.1.0-rc.5](https://github.com/effekt/nubbin/compare/store-fs-v0.1.0-rc.4...store-fs-v0.1.0-rc.5) (2026-08-19)


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
