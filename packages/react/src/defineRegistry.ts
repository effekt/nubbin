import type { BlockRegistry } from "./registry.types";

// Identity at runtime. The call site's object literal is the point: each value is an `import()`
// the bundler can see statically, which is what per-block code-splitting rests on.
//
// `R` is returned rather than `BlockRegistry` so the map keeps its exact keys where it is
// written. Indexing the widened form by an arbitrary string is the renderer's problem, and the
// renderer takes `BlockRegistry` for exactly that reason.
/**
 * Declares the registry a render reads: block name → a function importing that block's component.
 * It hands back the object it was given, unchanged and with the same identity, so the value a
 * renderer holds is the call site's own literal — which is what a bundler analyses to emit one
 * chunk per block.
 *
 * The return type is the literal's own, so `registry.Hero` is a known key where it is written and
 * a misspelling is a compile error. Handing it to `Renderer` widens it to {@link BlockRegistry},
 * where the keys are `string`: the renderer indexes it by whatever names an artifact carries, and
 * no literal type covers those.
 *
 * There are no schemas here. A block's schema belongs to the authoring side — `defineBlock` and
 * `defineCatalog` in `@nubbin/core` — and `compile` has already validated every prop against it
 * before an artifact exists. A registry entry is therefore a component and nothing more: what a
 * route pulls in is the block, not the schema that judged its props.
 *
 * @typeParam R - Inferred from the argument. Widen it deliberately by annotating the variable
 *   `BlockRegistry`; there is no reason to pass it explicitly.
 * @param registry - Block name → an importer for that block's component. Write it as an object
 *   literal of `import()` calls: a specifier assembled at runtime, or a registry spread together
 *   from variables, defeats the static analysis the per-block splitting rests on. Each key has to
 *   match the `name` its block was registered under, casing included, because that is the name an
 *   artifact carries.
 * @returns The same object. Nothing is copied, frozen or checked — a key naming no real block is
 *   found when an artifact naming it fails to load, not here.
 *
 * @example A registry the bundler can split
 * ```ts
 * import { defineRegistry } from "@nubbin/react";
 *
 * export const registry = defineRegistry({
 *   Hero: async () => (await import("./blocks/Hero")).Hero,
 *   Price: async () => (await import("./blocks/Price")).Price,
 * });
 *
 * registry.Hero; // a known key here — `registry.Herro` does not compile
 * ```
 *
 * @example What the renderer holds instead
 * ```ts
 * import type { BlockRegistry } from "@nubbin/react";
 *
 * const widened: BlockRegistry = registry;
 * widened["Anything"]; // `(() => Promise<BlockComponent<never>>) | undefined`
 * ```
 */
export function defineRegistry<R extends BlockRegistry>(registry: R): R {
  return registry;
}
