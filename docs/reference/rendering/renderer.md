---
title: Renderer and Block Registry
summary: The @nubbin/react surface as shipped — Renderer, defineRegistry, loadBlocks, and the block, hole and renderer types
status: reference
---

# Renderer and block registry

This page describes the shipped surface of `@nubbin/react`: the
[`Renderer`](../generated/react/functions/Renderer.md) server component,
[`defineRegistry`](../generated/react/functions/defineRegistry.md),
[`loadBlocks`](../generated/react/functions/loadBlocks.md), and the
[`BlockComponent`](../generated/react/type-aliases/BlockComponent.md),
[`BlockRegistry`](../generated/react/type-aliases/BlockRegistry.md),
[`RendererProps`](../generated/react/interfaces/RendererProps.md),
[`HoleContext`](../generated/react/interfaces/HoleContext.md) and
[`HoleResolver`](../generated/react/type-aliases/HoleResolver.md) types — every one of them
declared where it is defined, and generated from there. The package renders an artifact tree
against a registry of blocks and evaluates nothing the artifact carries — why that boundary
exists is [Artifacts contain data, never code](../../decisions/artifacts-contain-data-never-code.md).

## What a render does

`Renderer` loads the blocks the artifact names — `Object.keys(artifact.blockVersions)` — then
walks `artifact.tree`, rendering each node, and wraps the results in a `Fragment`. A block is
invoked and its root element cloned rather than wrapped, which is what obliges it to be a
server component: [Blocks are server components](../../decisions/blocks-are-server-components.md).

A node fills its holes before its block is invoked, because a block reads a hole as an ordinary
prop. A node that declares holes and was given no `resolveHole` refuses, naming the node —
rendering the placeholder instead would put a compile-time artefact in front of a visitor with
nothing to notice it.

## Holes

The renderer decides where a resolved value lands; the resolver the consumer supplies decides
what it is. It receives the hole's spec and never a value, and mapping a declared lifecycle onto
a caching layer belongs to the framework binding — `@nubbin/next`'s
[`holeFetchOptions`](next.md#holefetchoptions) is that mapping for Next.
