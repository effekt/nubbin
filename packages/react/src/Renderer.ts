import type { ReactElement } from "react";
import { createElement, Fragment } from "react";
import { loadBlocks } from "./loadBlocks";
import type { RenderContext, RendererProps } from "./renderer.types";
import { renderNode } from "./renderNode";

// It reads an already-validated artifact — no schema is parsed here, and nothing the artifact
// carries is evaluated. `blockVersions` is the whole list of blocks the artifact names, so a
// registry of any size costs this route only those imports.
//
// The artifact's own route travels down the walk in the context rather than being asked for
// again, so every hole on the page resolves against the route the page was compiled for and not
// against whatever URL happened to match it.
/**
 * An async server component that renders one compiled artifact against a registry of blocks. It
 * loads the blocks the artifact names, walks `artifact.tree` in order, and returns every root
 * inside a single `Fragment`. It reads nothing and writes nothing — fetching the artifact belongs
 * to the caller.
 *
 * Each node fills its holes, renders its slots, then invokes its block. Holes are filled first
 * because a block reads a resolved field as an ordinary prop, and a value arriving after the call
 * would render as `undefined` with nothing to notice it. Slot children reach the block the same
 * way: the nodes filling `slots.sections` arrive as `props.sections`, an array of elements the
 * block places itself, with no wrapper invented around them.
 *
 * What a block returns is cloned rather than wrapped, so the element the consumer wrote comes
 * back carrying `data-nubbin-node` and nothing is added to the tree. That is what obliges a block
 * to return exactly one HTML element.
 *
 * Sibling nodes render concurrently — the roots of `tree` and the children of one slot are all in
 * flight together — while the holes on a single node resolve one after another, in the order the
 * artifact lists them.
 *
 * @param props - The artifact to render, the registry to render it against, and the optional
 *   `resolveHole`; every field is described on {@link RendererProps}. Only those three are read,
 *   and none of them is mutated.
 * @returns One `Fragment` holding one element per entry in `artifact.tree`, in that order. A
 *   server tree can render the component directly — awaiting it by hand is only needed off the
 *   render path, such as in a test.
 *
 * @throws {NubbinError} Coded `block-not-loaded` when the registry has no importer for a block
 *   the artifact names, listing every missing name in one message rather than the first. The same
 *   code covers the narrower case of a node naming a block absent from `blockVersions`, which
 *   names the node.
 * @throws {NubbinError} Coded `no-hole-resolver` when a node declares holes and no `resolveHole`
 *   was given, naming the node. Rendering the node without the field would put a compile-time
 *   artefact in front of a visitor with nothing to notice it.
 * @throws {NubbinError} Coded `not-one-host-element` when a block returns anything but a single
 *   HTML element — a Fragment, an array, `null`, or a composite such as `<Card>`. Cloning a
 *   composite root succeeds and sets `data-nubbin-node` as a prop the component never spreads, so
 *   the block would render correctly and be unselectable; the renderer refuses instead.
 * @throws Whatever an importer, a `resolveHole` call or a block itself raises, unchanged. None of
 *   them is caught, so a failed hole fails the render rather than rendering the node without it.
 *
 * @example Serve whatever is published at a route
 * ```tsx
 * import { Renderer, defineRegistry } from "@nubbin/react";
 * import { notFound } from "next/navigation";
 *
 * const registry = defineRegistry({
 *   Hero: async () => (await import("./blocks/Hero")).Hero,
 *   Price: async () => (await import("./blocks/Price")).Price,
 * });
 *
 * export default async function Page() {
 *   const pointer = await store.pointer("/promotions/summer");
 *   const artifact = pointer === null ? null : await store.read(pointer.hash);
 *   if (artifact === null) notFound();
 *   return <Renderer artifact={artifact} registry={registry} resolveHole={resolveHole} />;
 * }
 * ```
 *
 * @example Render to markup, filling the fields compile left as holes
 * ```tsx
 * import { renderToStaticMarkup } from "react-dom/server";
 *
 * const html = renderToStaticMarkup(
 *   await Renderer({
 *     artifact,
 *     registry,
 *     resolveHole: async ({ route, block, path, spec }) =>
 *       priceFor(route, block, path, spec.revalidate),
 *   }),
 * );
 * ```
 */
export async function Renderer({
  artifact,
  registry,
  resolveHole,
}: RendererProps): Promise<ReactElement> {
  const blocks = await loadBlocks(registry, Object.keys(artifact.blockVersions));
  const context: RenderContext = { route: artifact.route, blocks, resolveHole };
  const children = await Promise.all(artifact.tree.map((node) => renderNode(node, context)));
  return createElement(Fragment, null, children);
}
