/** Puck's zone compound split back into its parts: `root:default-zone` and
 * `<nodeId>:<slotName>` both read as the id before the first colon and the zone after it,
 * and a slot name holding a colon survives because only the first one splits. */
export function parseZoneCompound(zone: string): { parentId: string; slot: string } {
  const at = zone.indexOf(":");
  if (at < 0) {
    return { parentId: zone, slot: "" };
  }
  return { parentId: zone.slice(0, at), slot: zone.slice(at + 1) };
}
