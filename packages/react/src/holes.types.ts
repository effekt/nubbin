import type { FieldHintData } from "@nubbin/core";

// Everything identifying the hole is on the argument, so a resolver is a function of what it was
// handed and needs no closure over the request it is serving.
/**
 * What the renderer tells a hole resolver about the field it is asking for. One of these reaches
 * {@link HoleResolver} per hole per render, immediately before the block that reads that field is
 * invoked.
 *
 * @example Route a hole to whichever source owns that field
 * ```ts
 * import type { HoleContext } from "@nubbin/react";
 *
 * const sourceFor = ({ block, path }: HoleContext) =>
 *   block === "Price" && path === "amount" ? pricing : cms;
 * ```
 */
export interface HoleContext {
  /**
   * The route the artifact was compiled for, as `artifact.route` carries it. That is the pattern
   * a `param` or `prefix` page was published at — `/guides/[city]`, not the `/guides/lisbon` a
   * request matched against it.
   */
  route: string;
  /**
   * The id of the node whose field this is, stable across recompiles of the same document
   * element. It is what the renderer stamps into `data-nubbin-node`, so a value traced in the
   * browser leads back to the resolver call that produced it.
   */
  nodeId: string;
  /** The block's registered name — the same name the registry is keyed by. */
  block: string;
  /**
   * The field, as the dotted schema path the block's `ui.fields` hint named it: `amount`,
   * `cta.label`. The resolved value is written back at exactly this path.
   */
  path: string;
  /** `{ revalidate: n }` — exactly what compile wrote into the artifact. */
  spec: FieldHintData;
}

// Supplied by the consumer. The renderer decides where a value lands; the resolver decides what
// it is. It receives the spec and never a value — the stored placeholder was dropped at compile,
// and mapping a lifecycle onto a caching layer belongs to the framework binding.
/**
 * The consumer's answer to "what goes in this field": one async function, called once per hole
 * per render, returning the value that field should hold.
 *
 * Where the value lands is the renderer's business — it is written back at the hole's dotted path
 * before the block is invoked, so the block reads it as an ordinary prop and cannot tell a
 * resolved field from a frozen one. What the value is, and what caching or fetching produces it,
 * is entirely this function's.
 *
 * It is handed the field's spec and never a stored value: `compile` discarded whatever the author
 * had typed into a field it turned into a hole, so there is no placeholder to fall back on. Turning
 * `spec.revalidate` into a framework's caching options is the framework binding's job —
 * `@nubbin/next` ships `holeFetchOptions` for exactly that.
 *
 * @param context - The hole being asked for: route, node, block, dotted path and spec. See
 *   {@link HoleContext}.
 * @returns The field's value, in the shape the block's schema described at that path. Nothing
 *   re-validates it — the artifact was validated at compile and this value was not there then —
 *   so a resolver returning the wrong shape reaches the component unchallenged.
 * @throws Nothing is caught. A rejection propagates out of `Renderer` and fails the render, rather
 *   than rendering the node with the field missing.
 *
 * @example Map the field's declared lifecycle onto a caching layer
 * ```ts
 * import type { HoleResolver } from "@nubbin/react";
 *
 * const resolveHole: HoleResolver = async ({ block, path, spec }) => {
 *   const response = await fetch(`https://api.example.com/${block}/${path}`, {
 *     next: { revalidate: spec.revalidate },
 *   });
 *   return response.json();
 * };
 * ```
 */
export type HoleResolver = (context: HoleContext) => Promise<unknown>;
