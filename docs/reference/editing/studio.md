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
  under stable generated keys, labelled by the first string field the catalog does not
  hint as a link, reordered by drag or buttons, with add and remove disabled at the
  schema's bounds and the reason in the control's title — an object as a fieldset
  recursing per sub-field with the same per-kind controls, and a `richText()` array as
  the rich text control, recognized by its described shape: block rows holding spans, with
  marks and the link toggled on the selected span from `core`'s closed set, so nothing the
  control produces is something the schema would refuse. Only a kind the description
  cannot reach renders read-only, and a
  slot's `allow` constraint refuses an illegal drop before it lands — Enter on a palette
  row inserts the block after the selection under the same refusal, so the keyboard and
  the mouse build the same documents. With nothing selected the inspector is the Page
  panel: every `DocumentMeta` field — title, description, robots, canonical — edits
  there, and an optional field an author empties folds back to absent rather than saving
  an empty string. A string whose
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
  page, or that process keeps answering from its cache. The button is a split control: a
  landed publish reports its three steps with the durations the server measured and links
  the page the visitor now sees, while a refusal hands its issues to the pill below.
  `/api/artifact/<route>` hands back
  the compiled JSON instead, for carrying to any store.
- **Route** — the toolbar's switcher lists every route the editor can open — the demo's
  fixtures plus any page begun in the studio — and its New page form posts `/api/routes`,
  which judges the route with the compiler's own parser, answers a conflict for one the
  studio already edits, and writes a blank draft. A page can begin in the editor rather
  than as a fixture someone commits first, and it begins blank rather than as a copy of
  another page.
- **Recall** — `/api/history/<route>` is the moves that route has made, newest first and
  capped at the last twenty, read
  through the store's optional `history`; the chevron beside the Publish button discloses
  them. `/api/rollback` points the route back at one of
  them, and refuses when it cannot: it runs `checkRollback` first, so an artifact whose blocks
  have moved on since it was written is named rather than served. That is the same refusal the
  command line makes, from the same function.

The header's amber pill counts what the compiler refused, present exactly while the draft has
issues, and a strip under the canvas carries the publish state, the same count, and the
autosave note. An issue names the block it came from and
selects it on the canvas, so a message about a field on a node deep in a slot is a click rather
than a search — the compiler answers in paths, and a path is only useful to an author once
something turns it into a place.

Canvas widths are the consumer's own breakpoints, declared in the binding seam rather
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
point the studio at their own app. One of those seams is an environment variable rather than
code: `NUBBIN_CONSUMER_ORIGIN` is the origin of the application the studio publishes into —
the pointer move runs against it, and the publish response builds the live page's link from
it, so it is the one variable naming that address. The artifact store's directory is code in
the same binding — `storeDir` reaches the demo's own `.nubbin` — and the `NUBBIN_STUDIO_STORE`
override exists so parallel test files never share one directory.
