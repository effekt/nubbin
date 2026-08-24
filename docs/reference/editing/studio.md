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
  `boolean` and `enum` props edit in the inspector while other kinds render read-only, and a
  slot's `allow` constraint refuses an illegal drop before it lands. Every change — a drop, a
  reorder, a delete, a prop edit — folds back into a Nubbin document and saves to the draft
  store on a debounce; a value the schema refuses still saves, with the compiler's issues in
  the reply, because publish is the gate rather than save.
- **Preview** — `/preview/<route>` compiles the current draft and renders it through
  `Renderer` with the demo's block registry, so the page on screen is the page the demo
  would serve.
- **Publish** — the editor's Publish button compiles the draft, writes the artifact into the
  demo's store, and moves the route pointer through the demo's own
  `api/nubbin/publish` handler — the pointer must move inside the process that serves the
  page, or that process keeps answering from its cache. `/api/artifact/<route>` hands back
  the compiled JSON instead, for carrying to any store.

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
