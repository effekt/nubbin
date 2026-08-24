---
title: Blocks and the Registry
summary: defineBlock and createRegistry as shipped — what registration rejects, and what the fingerprint covers
status: reference
---

# Blocks and the registry

This page describes the shipped behaviour of `defineBlock`, `createRegistry` and `richText` —
what they reject, and why. Every signature, field and type they involve is generated from the
source into [the API reference](generated/core/README.md); the reasoning behind the
shape lives in [`api.md`](../api.md) and [the decisions](../decisions/README.md).

## `defineBlock`

[`defineBlock`](generated/core/functions/defineBlock.md) takes a
[`Block`](generated/core/interfaces/Block.md) and, at runtime, returns it unchanged. Its
job is to fix the two generic parameters at the call site, so the component's props follow from
the output side of the schema rather than from a second declaration beside it — see
[Props inferred from the schema, never declared](../decisions/props-inferred-from-the-schema-never-declared.md).

Derived from `packages/core/src/defineBlock.test.ts` and the demo's
`examples/demo/src/blocks/Hero.block.ts`:

```ts
import { defineBlock } from "@nubbin/core";
import type { InferProps } from "@nubbin/core";
import { z } from "zod";

const heroSchema = z.object({
  headline: z.string(),
  tone: z.enum(["light", "dark"]),
});

type HeroProps = InferProps<typeof heroSchema>;
// { headline: string; tone: "light" | "dark" }

const Hero = (props: HeroProps) => null;

export const heroBlock = defineBlock({
  name: "Hero",
  schema: heroSchema,
  component: Hero,
  version: 1,
  slots: {},
});
```

`defineBlock` throws on the mistakes the type system cannot catch:

| Rejected | Why |
|---|---|
| A `version` that is not an integer of 1 or more | Artifacts record the block versions they compiled against, and a version below 1 has no artifact that could record it |
| A slot whose `min` exceeds its `max` | No composition could satisfy it |

A schema that validates asynchronously is refused too, because compile and registration are
both synchronous and neither can await an answer.

## `richText`

[`richText()`](generated/core/functions/richText.md) is a field of inline content as
data. Marks and block kinds are both closed sets, both objects are closed, and a key the shape
does not declare is rejected rather than dropped — see
[Rich text is typed data, never markup](../decisions/rich-text-is-typed-data-never-markup.md).

| Rejected by `validate()` | Reported at |
|---|---|
| A value that is not an array | the field itself |
| A block whose `kind` is outside the set | `<index>.kind` |
| A span whose `text` is not a string | `<index>.spans.<index>.text` |
| A mark outside the set | `<index>.spans.<index>.marks.<index>` |
| A key neither shape declares | the key |

`core` writes the schema itself rather than reaching for a validator, so the projection the
studio reads comes from `~standard.jsonSchema.input` alongside `~standard.validate`. Both are
what `zodAdapter.describe` walks to reach `body[].spans[].text` and the two enums.

A validator will not necessarily hold it. zod checks that every value in an object shape is a
zod schema, so `z.object({ body: richText() })` throws at the first parse. A block written in
zod seats the schema once — `examples/demo/src/blocks/shared/richText.schema.ts` carries the
value through `z.unknown()`, runs `core`'s `validate` as the check, and passes
`~standard.jsonSchema.input(…)` to `.meta()` so the projection survives.

## `StandardDataSchema`

[`StandardDataSchema`](generated/core/interfaces/StandardDataSchema.md) is what a schema
`core` writes itself guarantees over the Standard Schema interface generally: `validate` answers
synchronously, which compile requires of any schema, and the JSON Schema converter is present
rather than optional. It satisfies both `StandardSchemaV1` and `StandardJSONSchemaV1`, so a
block, a catalog entry, or an adapter takes it wherever either is accepted.

## `createRegistry`

Derived from `packages/core/src/createRegistry.test.ts`:

```ts
import { createRegistry, defineBlock } from "@nubbin/core";
import { z } from "zod";

const pageBlock = defineBlock({
  name: "Page",
  schema: z.object({ title: z.string() }),
  component: null,
  version: 1,
  slots: { items: { allow: ["Testimonial"] } },
});

const testimonialBlock = defineBlock({
  name: "Testimonial",
  schema: z.object({ quote: z.string() }),
  component: null,
  version: 1,
  slots: {},
});

const registry = createRegistry([pageBlock, testimonialBlock]);

registry.get("Page")?.name; // "Page"
registry.get("Nope"); // undefined
registry.names(); // ["Page", "Testimonial"]
```

Slot `allow` lists resolve only once every block is in, so an entry may reference a block
that appears later in the array — its order carries no meaning.

[`createRegistry`](generated/core/functions/createRegistry.md) throws on:

| Rejected | Why |
|---|---|
| Two blocks sharing a `name` | Names are the identity nodes resolve through, so a duplicate would make resolution depend on order |
| An `allow` entry naming no registered block | The slot would silently reject every child, including the one the author meant. Every unresolvable entry is reported at once, quoted as `"entry" (Block.slot)` |

## `Registry`

A [registry](generated/core/interfaces/Registry.md) answers two questions and holds no
identity of its own. What an artifact records about the registry it compiled against is
`blockVersions` — the name and version of each block the document actually uses — which is what
[the guardrail](artifacts.md#artifact) compares.
