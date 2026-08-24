---
title: Running the Studio
summary: The editor as shipped — what it reads from a catalog, how a draft is saved, and what a consumer replaces to point it at their own app
status: reference
---

# Studio

A Next.js application for composing and publishing pages from the demo's block catalog:

- **Parse** — `/` lists every block in the demo's catalog with the fields `zodAdapter`
  derives from each schema: path, kind, presence, enum members.
- **Edit** — `/edit/<route>` hosts [Puck](https://puckeditor.com) with a config derived
  from that catalog ([the decision](../../decisions/puck-is-the-iteration-one-editor.md)):
  every block is a palette entry rendered by the demo's own component, `string`, `number`,
  `boolean` and `enum` props edit in the inspector, an array edits as a repeater — rows
  under stable generated keys, labelled by their own first string field, reordered by drag
  or buttons, with add and remove disabled at the schema's bounds and the reason in the
  control's title — an object as a fieldset recursing per sub-field with the same per-kind
  controls, only a kind the description cannot reach renders read-only, and a
  slot's `allow` constraint refuses an illegal drop before it lands. A string whose
  catalog entry hints `control: "link"` gets the link control at any depth: an absolute
  http(s) URL or a root-relative path shows an Open link — relative paths resolve against
  the consumer origin, since the studio's own origin is not where the pages serve — and
  anything else shows a quiet note, in the muted ink rather than the error tone, because
  the value still saves either way. Every change — a drop, a
  reorder, a delete, a prop edit — folds back into a Nubbin document and saves to the draft
  store on a debounce; a value the schema refuses still saves, with the compiler's issues in
  the reply, because publish is the gate rather than save. Resting on a palette row floats
  the block itself beside the card, an iframe of `/block-preview/<name>` — the block
  compiled and rendered server-side from its catalog `defaults`, required slots filled with
  the first block each allows — so the preview is the component as shipped and cannot go
  stale the way a screenshot would.
- **Preview** — `/preview/<route>` compiles the current draft and renders it through
  `Renderer` with the demo's block registry, so the page on screen is the page the demo
  would serve.
- **Publish** — the editor's Publish button compiles the draft, writes the artifact into the
  demo's store, and moves the route pointer through the demo's own
  `api/nubbin/publish` handler — the pointer must move inside the process that serves the
  page, or that process keeps answering from its cache. `/api/artifact/<route>` hands back
  the compiled JSON instead, for carrying to any store.
- **Route** — `/api/routes` lists what the store holds and mints a route that is not there
  yet, so a page can begin in the editor rather than as a fixture someone commits first. A new
  route opens on a blank document rather than a copy of another page.
- **Recall** — `/api/history/<route>` is the moves that route has made, newest first, read
  through the store's optional `history`. `/api/rollback` points the route back at one of
  them, and refuses when it cannot: it runs `checkRollback` first, so an artifact whose blocks
  have moved on since it was written is named rather than served. That is the same refusal the
  command line makes, from the same function.

The inspector reports what the compiler refused. An issue names the block it came from and
selects it on the canvas, so a message about a field on a node deep in a slot is a click rather
than a search — the compiler answers in paths, and a path is only useful to an author once
something turns it into a place.

Canvas widths are the consumer's own breakpoints. They are read from the binding seam rather
than invented for the editor, so an author checking a layout at `md` is checking the width the
consumer's stylesheet actually breaks at.

Drafts start as the demo's committed fixtures. A committed edit writes to a gitignored
`.drafts/` directory beside the app, with one file per route. Drafts survive a restart, while
a checkout without draft files serves the fixtures unchanged. This directory is an autosave
slot rather than the authoring store; the
[domain model](../../concepts/domain-model.md#what-this-model-has-not-settled) leaves the
authoring-store contract open. The studio
[runs unauthenticated behind whatever gate the deployment provides](../../decisions/the-studio-does-not-own-identity.md).

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
whole binding — store path, draft state, the Puck config and data adapters, the consumer
origin the publish goes through, hole resolution — and is what a consumer would replace to
point the studio at their own app. Two of those seams are environment variables rather than
code: `NUBBIN_CONSUMER_ORIGIN` is the origin of the application the studio publishes into —
the pointer move runs against it, and the publish response builds the live page's link from
it, so it is the one variable naming that address — and `NUBBIN_STUDIO_STORE` is the
directory the artifact store writes.
