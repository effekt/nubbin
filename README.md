# Nubbin

**Your components. Their pages.**

Nubbin is a page builder that lives inside your codebase. Developers define blocks from application components, and content authors compose pages from those blocks. Publishing validates the page and compiles it into an immutable artifact that your application can serve without a Nubbin runtime dependency.

[Website](https://nubbin.io) · [Documentation](docs/README.md) · [GitHub](https://github.com/effekt/nubbin)

Nubbin is not a general-purpose content management system (CMS). It gives people who do not write code a way to publish pages from components your application already owns.

```bash
npm install @nubbin/core
```

![A terminal publishing a page while a browser shows it change: the card shelf and the changes
feed trade places, revert, and one card is rewritten](docs/media/publish-loop.svg)

[Explore the demo application](examples/demo/README.md) for a complete integration and usage
examples.

## How Nubbin works

Nubbin separates the component contract from the content that uses it:

1. **Developers define blocks in code.** A block combines a component with a schema that validates its props.
2. **Authors compose documents.** Documents store block names, props, slots, and page metadata as data.
3. **Publishing compiles artifacts.** Compilation validates the document, freezes static values, and records fields that resolve from live data.
4. **Your application renders the result.** Published pages read immutable artifacts from storage you control.

Each block declares its schema once, so the component props and authoring controls share one contract:

```ts
import { defineBlock } from "@nubbin/core";
import { z } from "zod";
import { Hero } from "./Hero";

const heroSchema = z.object({
  title: z.string(),
  price: z.number(),
});

export const heroBlock = defineBlock({
  name: "Hero",
  schema: heroSchema,
  component: Hero,
  version: 1,
  slots: {},
});
```

Use catalog field hints to keep a value live instead of freezing it when you publish. See the [`defineBlock` and catalog reference](docs/reference/authoring/blocks.md) for the complete authoring model.

## Why Nubbin

Nubbin keeps schemas in your repository and content in a store. Code changes follow your application deployment process, while content changes can publish independently.

| Principle | Result |
|---|---|
| **Schema in code** | Component props derive from the schema, so there is no second type definition to maintain. |
| **Content as data** | Documents can change without rebuilding the application. |
| **Immutable artifacts** | Each publish creates a content-addressed result that can be cached or restored by moving a route pointer. |
| **No deploy to publish** | Compilation validates and serializes content without invoking a bundler. |
| **Outside the render path** | Your application serves published artifacts from its own storage. |
| **Bring your own infrastructure** | Storage, authentication, and framework integration stay behind adapters. |
| **Portable core** | `@nubbin/core` depends only on Standard Schema and runs in browsers, workers, servers, and build steps. |

## Packages

Each package owns one part of the integration:

| Package | Purpose |
|---|---|
| [`@nubbin/core`](packages/core/README.md) | Block definitions, catalogs, registries, documents, compilation, and artifact contracts |
| [`@nubbin/react`](packages/react/README.md) | React rendering and live-data resolution |
| [`@nubbin/next`](packages/next/README.md) | Next.js route resolution, publishing, and cache invalidation |
| [`@nubbin/store-fs`](packages/store-fs/README.md) | Filesystem implementation of the artifact store |
| [`@nubbin/cli`](packages/cli/README.md) | Compile, publish, roll back, and compatibility commands |

## Resources

Use these resources to understand Nubbin, integrate it, or follow its development:

| Resource | Purpose |
|---|---|
| [Nubbin documentation](https://nubbin.io) | Published guides, concepts, and reference documentation |
| [Documentation index](docs/README.md) | Repository documentation and suggested reading order |
| [Architecture](docs/concepts/architecture.md) | The contract, content, and artifact model |
| [Decisions](docs/decisions/README.md) | Settled design choices, rejected alternatives, and boundaries |
| [Domain model](docs/concepts/domain-model.md) | Entities, ownership, and relationships |
| [Studio guide](apps/studio/README.md) | Running and integrating the editor application |

Generated `CATALOG.md` files beside each package list its exports and their source files.

## Contributing

[`CONTRIBUTING.md`](CONTRIBUTING.md) covers setup and contribution guidance. [`AGENTS.md`](AGENTS.md) documents the architectural invariants and routes contributors to the repository checks.

Follow the [Contributor Covenant](CODE_OF_CONDUCT.md), and report vulnerabilities through the process in [`SECURITY.md`](SECURITY.md).

## License

Nubbin is licensed under the [MIT License](LICENSE). Everything in this repository is MIT.
