---
title: The Catalog
summary: defineCatalog as shipped — entries, field hints, defaults, and the schema introspection types
status: reference
---

# The catalog

This page describes the shipped behaviour of `defineCatalog` — what registration rejects, how a
hint addresses a field, and what an editing surface reads a block's fields through. The
declarations behind it are generated from the source into
[the API reference](generated/@nubbin/core/README.md). Why the catalog
exists apart from the registry is
[Catalog and registry are separate](../decisions/catalog-and-registry-are-separate.md); why
hints sit beside the schema rather than inside it is
[Editing hints live beside the schema, not inside it](../decisions/editing-hints-live-beside-the-schema-not-inside-it.md).

## `defineCatalog`

[`defineCatalog`](generated/@nubbin/core/functions/defineCatalog.md) returns its argument after
checking everything checkable at registration, because a bad hint or bad defaults are silent at
every later point. Derived from
`packages/core/src/defineCatalog.test.ts` and the demo's
`examples/demo/src/nubbin/catalog.ts`:

```ts
import { defineCatalog } from "@nubbin/core";
import { z } from "zod";

const liveBandSchema = z.object({
  label: z.string(),
  items: z.array(z.object({ text: z.string(), at: z.string() })),
});

export const catalog = defineCatalog({
  LiveBand: {
    schema: liveBandSchema,
    defaults: { label: "On now", items: [] },
    ui: { fields: { items: { data: { revalidate: 60 } } } },
  },
});
```

It throws on:

| Rejected | Why |
|---|---|
| A `ui.fields` key naming a path the schema does not define | An unresolvable hint is invisible at runtime — the inspector falls back to a default treatment and renders something plausible. The error names the block, every bad path, and the paths the schema does define |
| `defaults` that fail the entry's own schema | Defaults are what a freshly dropped block renders with, so invalid defaults produce a block that is broken the instant it is placed |
| A `data` hint on a path containing `[]` | A hole resolves to one value, and an array-member path names every member, so it has no single target. Such a path may still carry a hint; only a `data` one is refused |
| Two `data` hints on one block whose paths nest, such as `cta` and `cta.label` | Two holes writing into one value have no defined order of application — see [A `data` hint addresses a path, not a top-level key](../decisions/a-data-hint-addresses-a-path-not-a-top-level-key.md) |

Hint paths are resolved by reading the schema through the Standard JSON Schema converter the
schema itself exposes (`~standard.jsonSchema`, Standard Schema spec 1.1) — the package calls
no validator function and imports no validator. Two consequences, both thrown at
registration:

- a schema that does not expose the converter is rejected when its entry carries `ui.fields`;
- a field JSON Schema cannot express is rejected rather than degraded, because the converter
  runs with `unrepresentable: "throw"`.

`defaults` are validated with the schema's own `~standard.validate`, which must be
synchronous — an async validator is refused with an error.

An entry carrying only `schema` is stored as-is; both checks run only when the fields they
check are present.

## `Catalog` and `CatalogEntry`

Keys of a [`Catalog`](generated/@nubbin/core/type-aliases/Catalog.md) are block names — the same
names the [registry](blocks.md#createregistry) resolves. A
[`CatalogEntry`](generated/@nubbin/core/interfaces/CatalogEntry.md) is serializable data only:
schema, hints, defaults, docs, and never a component. That is
the catalog/registry split — an editing surface and CI read the catalog; rendering needs the
registry.

`schema` is typed `unknown` rather than `StandardSchemaV1` because the capability actually
required — the JSON Schema converter — is narrower than the validation interface, and the
runtime check happens either way.

## `BlockUi` and `FieldHint`

[`BlockUi.fields`](generated/@nubbin/core/interfaces/BlockUi.md) is keyed by schema path in
dotted form, with `[]` addressing array members:
`title`, `cta.label`, `items[].icon`. Every key must resolve against the entry's schema —
see the registration checks above. Why paths rather than a mapped type, and how a control is
chosen from a [`FieldHint`](generated/@nubbin/core/interfaces/FieldHint.md), are argued in
[`api.md`](../api.md).

## `FieldHintData`

A [`data` hint](generated/@nubbin/core/type-aliases/FieldHintData.md) says how a field's value
resolves at render. An absent `data` hint means static: the value freezes
into the artifact's props at compile. A hint means the value is left out and resolved by the
consumer's resolver instead, cached for `revalidate` seconds. The two states and the reasoning are
[Data lifecycle is per field](../architecture.md#data-lifecycle-is-per-field); what the
compiler does with the hint is on the [compile page](compile.md#holes-what-a-data-hint-compiles-to).

## `SchemaAdapter`, `FieldNode` and `FieldKind`

[`SchemaAdapter`](generated/@nubbin/core/interfaces/SchemaAdapter.md) is the contract for
reading a schema's field structure: `describe` returns
one [`FieldNode`](generated/@nubbin/core/interfaces/FieldNode.md) per addressable path, in the
same dotted form hint keys use, each carrying the
[`FieldKind`](generated/@nubbin/core/type-aliases/FieldKind.md) an inspector renders it as. The
schema root itself has no path, so the result is exactly the set of paths a hint may target.

## `zodAdapter`

[`zodAdapter`](generated/@nubbin/core/variables/zodAdapter.md) is
the shipped implementation — the adapter `defineCatalog` resolves hint paths through,
exported so an editing surface can describe a block's fields without the block's component.
It is named for the reference validator but reads any schema exposing the converter; why the
converter beat validator-internal traversal is argued in [`api.md`](../api.md). Duplicate
paths — a union whose branches share a field — are reported once, keeping the first kind
seen.
