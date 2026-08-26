# @nubbin/react

## [0.4.0](https://github.com/effekt/nubbin/compare/react-v0.3.0...react-v0.4.0) (2026-08-26)


### Miscellaneous Chores

* **react:** Synchronize nubbin versions

## [0.3.0](https://github.com/effekt/nubbin/compare/react-v0.2.0...react-v0.3.0) (2026-08-26)


### Miscellaneous Chores

* **react:** Synchronize nubbin versions

## [0.2.0](https://github.com/effekt/nubbin/compare/react-v0.1.1...react-v0.2.0) (2026-08-24)


### Miscellaneous Chores

* **react:** Synchronize nubbin versions

## [0.1.1](https://github.com/effekt/nubbin/compare/react-v0.1.0...react-v0.1.1) (2026-08-24)


### Miscellaneous Chores

* **react:** Synchronize nubbin versions

## [0.1.0](https://github.com/effekt/nubbin/compare/react-v0.1.0-rc.7...react-v0.1.0) (2026-08-24)


### Bug Fixes

* **cli:** stdout carries the answer, and --origin is taken as given ([a2d8ff3](https://github.com/effekt/nubbin/commit/a2d8ff36e3ca8663b5fb296d159d63d7cf3f0cb0))


### Miscellaneous Chores

* **repo:** cut 0.1.0 rather than another candidate ([0a9e869](https://github.com/effekt/nubbin/commit/0a9e8694eaeec79fd534ed2a6a00b346d843e4ca))

## [0.1.0-rc.7](https://github.com/effekt/nubbin/compare/react-v0.1.0-rc.6...react-v0.1.0-rc.7) (2026-08-23)


### ⚠ BREAKING CHANGES

* **core:** `CompileError`, `CompileIssue` and `CompileIssueCode` are replaced by `NubbinError`, `NubbinIssue` and `NubbinIssueCode`. `issue.nodeId` is now `issue.at`. `compile` returns `{ artifact, issues }` rather than an artifact.
* **core:** `Artifact.registryFingerprint`, `Registry.fingerprint()`, `BlockDocs`, `CatalogEntry.docs`, `Block.status`, `FieldHint.label`, `FieldHint.control` and the `"request"` member of `FieldHintData` are removed. Every artifact re-addresses, so a store written before this must be republished.

### Features

* **core:** one error surface, every refusal keyed by a code ([c9d74c7](https://github.com/effekt/nubbin/commit/c9d74c7816fb35f6607b8e57bdd4c25fd03aa2ca))


### Code Refactoring

* **core:** remove the published surface nothing reads ([8777c70](https://github.com/effekt/nubbin/commit/8777c70acdc6a9e837a7972d577e4b860031195e))

## [0.1.0-rc.6](https://github.com/effekt/nubbin/compare/react-v0.1.0-rc.5...react-v0.1.0-rc.6) (2026-08-19)


### Miscellaneous Chores

* **react:** Synchronize nubbin versions

## [0.1.0-rc.5](https://github.com/effekt/nubbin/compare/react-v0.1.0-rc.4...react-v0.1.0-rc.5) (2026-08-19)


### Features

* **repo:** a generated catalog answers "does this already exist" ([2d41486](https://github.com/effekt/nubbin/commit/2d414864667d41aa7ce2e055c540c3ceb5491364))
* the studio edits — select a block, change a field, the preview follows ([23fbe05](https://github.com/effekt/nubbin/commit/23fbe0579c99972f0a5903d811f210119e5df510))


### Bug Fixes

* **repo:** five product defects, each with the test that found it ([04ce3c7](https://github.com/effekt/nubbin/commit/04ce3c76905477d9b8d5a6d5160130f3638b0973))

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

- 38a0d6c: Installing this package no longer installs React. It declared React as a peer dependency, which
  npm installs by default, while importing nothing from it — the units it ships today resolve
  holes and set values at a path, and neither renders. The peer returns with the renderer, which
  is the point at which it becomes true.
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
