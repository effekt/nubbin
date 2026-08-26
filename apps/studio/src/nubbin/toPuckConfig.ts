import type { Config } from "@measured/puck";
import type { Catalog, Registry } from "@nubbin/core";
import { puckAdapter } from "@nubbin/studio-ui";
import { toPuckComponentConfig } from "./toPuckComponentConfig";

/** The whole Puck config, derived: one component per catalog block, each built by
 * `toPuckComponentConfig` from the pair the demo already maintains — the catalog for schema
 * and defaults, the registry for slots and the component. A catalog block the registry does
 * not hold is a configuration fault worth stopping on, not a component to skip. `root` is
 * the Page panel's field set — the whole `DocumentMeta`, from `toPuckRootConfig`. No
 * `categories`: the drawer override renders the studio's own palette, grouped by
 * `toPaletteGroups`, so Puck's own component list — the only thing categories feed — never
 * mounts. */
export function toPuckConfig(catalog: Catalog, registry: Registry): Config {
  const components: Config["components"] = {};
  for (const [name, entry] of Object.entries(catalog)) {
    const block = registry.get(name);
    if (block === undefined) {
      throw new Error(`the catalog names "${name}" but the registry holds no block for it`);
    }
    components[name] = toPuckComponentConfig(entry, block);
  }
  return {
    components,
    root: puckAdapter.rootConfig(),
  };
}
