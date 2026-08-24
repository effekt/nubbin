import { NubbinIssueCode, refuse } from "@nubbin/core";
import type { BlockComponent, BlockRegistry } from "./registry.types";

// Resolves only the named importers, in parallel. The unnamed rest of the registry is never
// touched — that, plus one chunk per importer, is why the hundredth block costs this route
// nothing.
//
// Every missing name is reported at once: an artifact compiled against a registry the app has
// since shrunk needs each name fixed separately, so failing on the first hides the work.
/**
 * Resolves named blocks out of a registry, in parallel, into a map from name to component.
 * `Renderer` calls it with `Object.keys(artifact.blockVersions)` before it walks the tree; call it
 * directly to warm a route, or to check a registry against an artifact ahead of serving one.
 *
 * Only the named importers run — an importer for a name not asked for is never invoked, so a
 * registry naming every block in the app costs a route only the blocks its own page uses.
 *
 * Every name is checked before any importer runs, so a missing one loads nothing at all: the
 * result is the whole set or a refusal, never a partial map. The refusal names every block the
 * registry cannot satisfy, comma-separated in one message.
 *
 * @param registry - Where the importers come from. Keys it holds and `names` does not are neither
 *   read nor invoked, so passing the application's whole registry is the intended use.
 * @param names - The blocks to load, matched against the registry's keys exactly, casing
 *   included. A name repeated in the list loads its importer once; an empty list resolves to `{}`
 *   and invokes nothing.
 * @returns Name → the component that name's importer resolved to, holding exactly the names asked
 *   for and no others. The components come back typed `BlockComponent`, widened from the
 *   `BlockComponent<never>` a registry stores — sound at this seam because what reaches them at
 *   render are props `compile` already validated against that block's schema.
 * @throws {NubbinError} Coded `block-not-loaded` when the registry has no importer for one or more
 *   of `names`. It is raised before any importer runs, so nothing has loaded when it lands.
 * @throws Whatever an importer raises. A dynamic `import()` that fails to resolve propagates
 *   unchanged, and one importer failing rejects the whole call.
 *
 * @example Load the blocks one artifact needs
 * ```ts
 * import { loadBlocks } from "@nubbin/react";
 *
 * const blocks = await loadBlocks(registry, Object.keys(artifact.blockVersions));
 * const Hero = blocks.Hero;
 * if (Hero !== undefined) {
 *   await Hero({ title: "Summer sale" });
 * }
 * ```
 *
 * @example Every missing name in one message
 * ```ts
 * await loadBlocks(registry, ["Ghost", "Hero", "Phantom"]);
 * // NubbinError: registry has no importer for: Ghost, Phantom
 * ```
 */
export async function loadBlocks(
  registry: BlockRegistry,
  names: readonly string[],
): Promise<Record<string, BlockComponent>> {
  const missing = names.filter((name) => registry[name] === undefined);
  if (missing.length > 0) {
    refuse(NubbinIssueCode.BlockNotLoaded, `registry has no importer for: ${missing.join(", ")}`);
  }
  const wanted = new Set(names);
  const loaded = await Promise.all(
    Object.entries(registry)
      .filter(([name]) => wanted.has(name))
      .map(async ([name, importer]) => [name, await importer()] as const),
  );
  // `BlockRegistry` stores `BlockComponent<never>` so that a component reading its own props can
  // be put in one at all — parameters are contravariant. Widening back is sound at the render
  // seam and nowhere else: what reaches a component here are props compile already validated
  // against that block's schema.
  return Object.fromEntries(loaded) as Record<string, BlockComponent>;
}
