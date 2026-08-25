import type { PuckData } from "./puckData.types";

/** Refuses a `Data` whose legacy `zones` holds content. Puck fills `zones` only through its
 * legacy `DropZone` API — the studio's config is slot-fields-only, so children always arrive
 * inline in slot props — but folding a `Data` that did use zones would silently drop those
 * children from the draft. An empty `zones` is Puck's own default and passes. */
export function assertNoPuckZones(data: PuckData): void {
  const zones = Object.keys(data.zones ?? {});
  if (zones.length > 0) {
    throw new Error(
      `puck handed legacy zones content (${zones.join(", ")}) — the adapter maps slot props only, and folding this would drop those children`,
    );
  }
}
