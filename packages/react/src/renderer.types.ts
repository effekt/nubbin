import type { Artifact } from "@nubbin/core";
import type { HoleResolver } from "./holes.types";
import type { BlockComponent, BlockRegistry } from "./registry.types";

// `resolveHole` is written `?: HoleResolver | undefined` rather than `?: HoleResolver` because
// `exactOptionalPropertyTypes` is on: destructuring an absent optional yields `undefined`, and
// `Renderer` assigns exactly that into `RenderContext`. Callers that omit it still typecheck.
/**
 * Everything `Renderer` reads. Nothing else on the object is looked at, so a page that carries
 * extra keys through loses nothing by handing the whole thing over.
 *
 * @example
 * ```tsx
 * import { Renderer } from "@nubbin/react";
 * import type { RendererProps } from "@nubbin/react";
 *
 * const props: RendererProps = { artifact, registry, resolveHole };
 * const page = <Renderer {...props} />;
 * ```
 */
export interface RendererProps {
  /**
   * The compiled page to render, as `compile` produced it and a store handed it back. Its
   * `blockVersions` decides which blocks load, its `tree` is walked in order, and its `route` is
   * what every hole on the page resolves against. It is read, never mutated, and nothing it
   * carries is evaluated.
   */
  artifact: Artifact;
  /**
   * Where the blocks come from. It may name far more blocks than this artifact uses — the extra
   * importers are never invoked — but a name the artifact carries and this omits refuses the
   * render before any block loads.
   */
  registry: BlockRegistry;
  /**
   * How a hole gets its value. Any artifact whose tree declares one needs it: omit it and that
   * node refuses rather than rendering without the field. A wholly static artifact renders with no
   * resolver at all, which is the fast path — the frozen props go through untouched.
   */
  resolveHole?: HoleResolver | undefined;
}

/** What the walk carries down: the route a hole resolves against, and the loaded blocks. */
export interface RenderContext {
  route: string;
  blocks: Record<string, BlockComponent>;
  resolveHole?: HoleResolver | undefined;
}
