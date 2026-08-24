import type { Catalog, Registry } from "@nubbin/core";
import type { PaletteBlock } from "./paletteGroup.types";
import { toBlockMeta } from "./toBlockMeta";

/** One block as the palette lists it, its description and icon resolved through the
 * registry-first precedence `toBlockMeta` carries. */
export function toPaletteBlock(catalog: Catalog, registry: Registry, name: string): PaletteBlock {
  return {
    name,
    description: toBlockMeta(catalog, registry, name, "description"),
    icon: toBlockMeta(catalog, registry, name, "icon"),
  };
}
