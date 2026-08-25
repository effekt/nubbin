import type { PuckComponentData } from "./puckData.types";

/** Whether a prop value is one Puck component — an object carrying a `type` name and a `props`
 * bag with a string `id`. The structural half of telling a slot-typed prop from an ordinary
 * one, since Puck's `Data` marks slots by content rather than by name. */
export function isPuckComponentData(value: unknown): value is PuckComponentData {
  if (typeof value !== "object" || value === null) return false;
  if (!("type" in value) || typeof value.type !== "string") return false;
  if (!("props" in value) || typeof value.props !== "object" || value.props === null) return false;
  return "id" in value.props && typeof value.props.id === "string";
}
