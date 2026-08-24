---
title: Studio
summary: How the editor reads a catalog, previews and edits drafts, and publishes artifacts
status: draft
---

# Studio

A Next.js application for composing and publishing pages from the demo's block catalog:

- **Parse** — `/` lists every block in the demo's catalog with the fields `zodAdapter`
  derives from each schema: path, kind, presence, enum members.
- **Preview** — `/preview/<route>` compiles the current draft and renders it through
  `Renderer` with the demo's block registry, so the page on screen is the page the demo
  would serve.
- **Edit** — select a block by clicking it in the preview or picking it from the inspector's
  list, and change its `string`, `number`, `boolean` and `enum` fields; `array`, `object`,
  `union`, `unknown` and `items[]` fields render read-only. A commit — blur for text, change
  for a checkbox or select — writes through `setNodeProp`, recompiles, and refreshes the
  preview; a value the schema refuses is rejected with the compiler's message beside the
  field, and the draft keeps its last good state.
- **Publish** — the preview's Publish button compiles the draft, writes the artifact into
  the demo's store, and moves the route pointer; Download artifact hands back the compiled
  JSON instead, for carrying to any store.

Drafts start as the demo's committed fixtures. A committed edit writes to a gitignored
`.drafts/` directory beside the app, with one file per route. Drafts survive a restart, while
a checkout without draft files serves the fixtures unchanged. This directory is an autosave
slot rather than the authoring store; the
[domain model](../../docs/concepts/domain-model.md#what-this-model-has-not-settled) leaves the
authoring-store contract open. The studio
[runs unauthenticated behind whatever gate the deployment provides](../../docs/decisions/the-studio-does-not-own-identity.md).

## Running it

```bash
pnpm --filter studio dev     # http://localhost:3001
pnpm --filter demo dev       # http://localhost:3000 — serves what the studio publishes
```

Publish a draft in the studio, then load the same route on the demo: the demo answers with
the artifact the studio wrote. A route never published is a real 404 there.

## The seam to the consumer

The studio reaches its catalog, registry, blocks and stylesheet through a workspace
dependency on `demo`, compiled from source via `transpilePackages`. `src/nubbin/` is the
whole binding — store path, draft state, the edit commit, hole resolution — and is what a
consumer would replace to point the studio at their own app.
