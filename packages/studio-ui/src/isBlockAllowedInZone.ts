import type { ComponentData, Config } from "@measured/puck";

/** Whether a block may be inserted into a Puck zone without breaking a slot allow-list. */
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
