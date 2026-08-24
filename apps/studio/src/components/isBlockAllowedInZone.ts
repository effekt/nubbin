import type { ComponentData, Config } from "@measured/puck";

/**
 * Whether a block may be inserted into one of Puck's zones without breaking a slot's
 * `allow` list — the same legality a drag is held to, asked before a keyboard insert
 * dispatches. The root zone accepts anything, as Puck's own drags do; a slot zone is
 * checked against the slot field's `allow`, and a zone whose parent the data no longer
 * holds refuses, because there is nowhere legal to land.
 */
export function isBlockAllowedInZone(
  config: Config,
  getItemById: (id: string) => ComponentData | undefined,
  zone: string,
  blockName: string,
): boolean {
  if (zone === "root:default-zone") {
    return true;
  }
  const split = zone.lastIndexOf(":");
  const parent = getItemById(zone.slice(0, split));
  if (parent === undefined) {
    return false;
  }
  const field = config.components[parent.type]?.fields?.[zone.slice(split + 1)];
  if (field === undefined || field.type !== "slot" || !("allow" in field)) {
    return true;
  }
  return field.allow === undefined || field.allow.includes(blockName);
}
