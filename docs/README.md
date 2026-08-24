---
title: Nubbin
summary: Install it, define a block, publish a page — and where to go for the surface you are integrating
status: stable
---

# Nubbin

A page builder that lives inside your codebase. You decide what can go on a page by writing
blocks; someone else arranges them without touching the code. What they arrange is data, what
you wrote is the contract, and publishing turns one into an immutable artifact the site serves.

![A terminal publishes a route while the browser beside it changes: two sections swap places,
revert, and a card is rewritten — all without a rebuild](media/publish-loop.svg)

## Install

```bash
npm install @nubbin/core @nubbin/react @nubbin/next @nubbin/store-fs
npm install -D @nubbin/cli
```

[`@nubbin/core`](https://www.npmjs.com/package/@nubbin/core) is the contract and depends on
nothing. The rest are adapters and any of them can be replaced — bring your own storage, your own
framework binding: [`@nubbin/react`](https://www.npmjs.com/package/@nubbin/react),
[`@nubbin/next`](https://www.npmjs.com/package/@nubbin/next),
[`@nubbin/store-fs`](https://www.npmjs.com/package/@nubbin/store-fs), and
[`@nubbin/cli`](https://www.npmjs.com/package/@nubbin/cli) for the terminal.

More about the project at [nubbin.io](https://nubbin.io).

## Define a block

A block is a schema beside a component. Props are inferred from the schema rather than declared
again next to it, so the two cannot disagree.

```ts
// Hero.schema.ts — any Standard Schema; zod here
export const heroSchema = z.object({
  headline: z.string(),
  tone: z.enum(["light", "dark"]),
});

// Hero.block.ts
export const heroBlock = defineBlock({
  name: "Hero",
  schema: heroSchema,
  component: Hero,
  version: 1,
  slots: {},
});
```

## Register it, twice

Publishing and rendering need different things, so there are two registries and neither
substitutes for the other.

```ts
// compile side — schemas and versions, what a document is validated against
export const registry = createRegistry([heroBlock]);

// render side — a loader per block, which the bundler splits into its own chunk
export const blockRegistry = defineRegistry({
  Hero: () => import("./blocks/Hero").then((module) => module.Hero),
});
```

## Publish a page

`nubbin.config.ts` tells the command line where everything lives. `document` is a function
rather than a table, because where documents live is yours.

```ts
export default defineConfig({
  catalog,
  registry,
  store: createFsArtifactStore("./.nubbin"),
  document: (route) => documents[route] ?? null,
});
```

```bash
npx nubbin publish /pricing
```

Compiling validates the document against every block's schema and serialises it. Nothing is
built and nothing is deployed — the artifact is written, then the route is pointed at it.

## Render it

One catch-all route resolves the artifact for a path and hands it to the renderer.

```tsx
const artifact = await resolveArtifact(store, routeFromSlug(slug));
if (artifact === null) notFound();

return <Renderer artifact={artifact} registry={blockRegistry} />;
```

## Let someone else edit it

Everything above is yours. The point of the blocks you registered is that the next change to
the page does not come back to you.

```bash
pnpm --filter studio dev
```

The studio reads your catalog and builds a palette from it. A block is dragged in, its props
edit against the schema you wrote, and Publish runs the same compile the command line does —
so a page nobody could publish from a terminal is a page nobody can publish from the editor
either. [Running the studio](reference/editing/studio.md) covers what it saves and when.

## Where to go next

| If you are | Read |
|---|---|
| Trying to understand the model | [How it works](concepts/architecture.md) |
| Writing blocks | [Blocks](reference/authoring/blocks.md) and [the catalog](reference/authoring/catalog.md) |
| Publishing from CI or a terminal | [Compiling](reference/publishing/compile.md), [artifacts](reference/publishing/artifacts.md), [the command line](reference/publishing/cli.md) |
| Rendering in an app | [The renderer](reference/rendering/renderer.md) and [the Next.js binding](reference/rendering/next.md) |
| Letting someone else edit pages | [Running the studio](reference/editing/studio.md) |
| Looking for a signature | [The API reference](reference/generated/README.md), written from the packages' own sources on every docs build |

## Every document

| Read | For | Status |
|---|---|---|
| **How it works** | | |
| [`concepts/architecture.md`](concepts/architecture.md) | How the contract/content/output split and the compile-at-publish pipeline fit together. **Start here.** | stable |
| [`concepts/domain-model.md`](concepts/domain-model.md) | Every entity, what owns it, and where it lives across the three layers | draft |
| [`concepts/authoring-flows.md`](concepts/authoring-flows.md) | What an author does step by step, and the failure modes each flow carries | draft |
| [`concepts/studio.md`](concepts/studio.md) | How the self-hosted canvas, cross-iframe drag, and preview are architected | stable |
| [`concepts/api.md`](concepts/api.md) | The shape of `defineBlock` through compile and render, and where UI hints live | draft |
| **Reference — authoring** | | |
| [`reference/authoring/blocks.md`](reference/authoring/blocks.md) | `defineBlock` and `createRegistry` as shipped — what registration rejects, and what an artifact records about a block | reference |
| [`reference/authoring/catalog.md`](reference/authoring/catalog.md) | `defineCatalog` as shipped — entries, field hints, defaults, and schema introspection | reference |
| **Reference — publishing** | | |
| [`reference/publishing/compile.md`](reference/publishing/compile.md) | `compile` as shipped — the document shape, the two validation passes, and every issue code | reference |
| [`reference/publishing/artifacts.md`](reference/publishing/artifacts.md) | The `Artifact` and `ArtifactStore` contracts as shipped, with the compatibility and rollback checks | reference |
| [`reference/publishing/cli.md`](reference/publishing/cli.md) | `@nubbin/cli` as shipped — the config file it resolves, the commands, and what each exit code means | reference |
| **Reference — rendering** | | |
| [`reference/rendering/renderer.md`](reference/rendering/renderer.md) | `@nubbin/react` as shipped — the `Renderer` server component, the registry types, and the hole resolver | reference |
| [`reference/rendering/next.md`](reference/rendering/next.md) | `@nubbin/next` as shipped — route resolution, static params, hole fetch options, and the two publish calls | reference |
| **Reference — editing** | | |
| [`reference/editing/studio.md`](reference/editing/studio.md) | The editor as shipped — what it reads from a catalog, how a draft is saved, and what a consumer replaces | reference |
| **Contributing** | | |
| [`contributing/documents.md`](contributing/documents.md) | What belongs in a document rather than an issue, and the gates that hold this corpus to it | stable |
| [`contributing/gates.md`](contributing/gates.md) | Every gate, what it enforces, where its verdict comes from, and the three that stay local | stable |
| [`contributing/releasing.md`](contributing/releasing.md) | How a version reaches npm, what decides it, and the two behaviours that surprise people | stable |
| [`contributing/environment.md`](contributing/environment.md) | The plugins, skills and toolchain this repository is worked on with, and how to reproduce them | stable |
| [`contributing/public-repository.md`](contributing/public-repository.md) | What may not appear here, and how to publish a finding without its provenance | stable |
| **Decisions** | | |
| [`decisions/`](decisions/README.md) | Settled choices and the reasoning behind them, one file per decision | stable |

The generated API reference carries no row: `docs/reference/generated/` is written by the docs
build from the packages' own sources, so listing it here would be a hand-maintained copy of a
directory listing.

`draft` means the shape is expected to move. `stable` means changing it is a design change,
not an edit. `reference` means the page describes the shipped surface — it changes when the
code does.
