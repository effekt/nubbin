import type { Config } from "@measured/puck";
import type { Registry } from "@nubbin/core";

/**
 * The palette's two groups, derived rather than declared: a block with a slot arranges
 * other blocks, so it files under Layout; everything else is Content. This mirrors the
 * canonical studio design's palette sections without adding a category field to the
 * catalog — the slot declaration already says which kind a block is.
 */
export function toPuckCategories(
  registry: Registry,
  names: readonly string[],
): NonNullable<Config["categories"]> {
  const hasSlots = (name: string) => Object.keys(registry.get(name)?.slots ?? {}).length > 0;
  return {
    content: { title: "Content", components: names.filter((name) => !hasSlots(name)) },
    layout: { title: "Layout", components: names.filter(hasSlots) },
  };
}
