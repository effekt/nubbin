import { toOrdinal } from "./toOrdinal";

/** The inspector head's quiet second line — `2nd block in Page body` — from the selected
 * node's index within its area and the area's own label. The index is Puck's, zero-based,
 * so the line says the position an author would count to. */
export function toPositionLine(index: number, areaLabel: string): string {
  return `${toOrdinal(index + 1)} block in ${areaLabel}`;
}
