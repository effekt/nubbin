import type { UnknownProps } from "@nubbin/core";
import type { ReactNode } from "react";

// `P` is the block's own props, so a block author has a name for their component —
// `BlockComponent<HeroProps>`. Async is allowed because rendering happens on the server.
/**
 * The shape a block's component has: props in, markup out. Type a block with it and the render
 * path's expectations are checked where the block is written rather than where it renders.
 *
 * It may be `async`, because a block renders on the server and never in the browser — a block
 * awaiting its own data is the ordinary case, and the renderer awaits what it returns either way.
 *
 * The return type permits any `ReactNode`; the renderer does not. It clones what the block
 * returned to stamp `data-nubbin-node` on it, so the root has to be exactly one HTML element. A
 * Fragment, an array, `null`, a string, or a composite such as `<Card>` is refused at render with
 * `not-one-host-element`, and no type here catches that earlier.
 *
 * @typeParam P - The block's own props. Pass `InferProps<typeof schema>` from `@nubbin/core` so
 *   they are derived from the block's schema rather than declared a second time beside it.
 *   Defaults to `UnknownProps`, which is what a component is held as once it has come out of a
 *   registry and lost its own type.
 *
 * @example A block typed from the schema that validates it
 * ```tsx
 * import type { InferProps } from "@nubbin/core";
 * import type { BlockComponent } from "@nubbin/react";
 * import { z } from "zod";
 *
 * const heroSchema = z.object({ title: z.string(), tone: z.enum(["light", "dark"]) });
 *
 * export const Hero: BlockComponent<InferProps<typeof heroSchema>> = ({ title, tone }) => (
 *   <section data-tone={tone}>
 *     <h1>{title}</h1>
 *   </section>
 * );
 * ```
 */
export type BlockComponent<P extends UnknownProps = UnknownProps> = (
  props: P,
) => ReactNode | Promise<ReactNode>;

// name → lazy importer. A literal map of `import()` calls, so the bundler emits a chunk per block.
//
// The stored props type is `never` because parameters are contravariant: a component that reads
// `title` cannot stand in for one obliged to accept any record, so `BlockComponent<UnknownProps>`
// here would reject every real block. The render site widens back with a single cast, because it
// is what holds the props compile validated against the block's schema.
/**
 * A registry as the renderer holds it: block name → a function that imports that block's
 * component. It is the widened form of what `defineRegistry` returns, keyed by `string` because a
 * renderer indexes it by whatever names an artifact carries — which no literal type covers.
 *
 * Annotate a variable with it to hand a registry around; build one with `defineRegistry`, which
 * keeps the literal's own keys where it is written and only widens to this at the render seam.
 *
 * The stored component's props are `never`, which is why a value pulled straight out of a
 * registry cannot be invoked: nothing satisfies `never`. `loadBlocks` is where that is undone, so
 * load through it rather than calling an importer by hand.
 *
 * @example
 * ```ts
 * import type { BlockRegistry } from "@nubbin/react";
 *
 * const registry: BlockRegistry = {
 *   Hero: async () => (await import("./blocks/Hero")).Hero,
 * };
 *
 * registry["Hero"]; // `(() => Promise<BlockComponent<never>>) | undefined`
 * ```
 */
export type BlockRegistry = Record<string, () => Promise<BlockComponent<never>>>;
