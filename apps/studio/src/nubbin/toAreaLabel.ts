import { humanizeFieldPath } from "@nubbin/studio";

/** The area a position line names: the document's own top level reads as "Page body", and
 * a slot under a block names the block and then the slot in the inspector's own words —
 * `SectionStack sections` — so the line matches what the outline already calls the area. */
export function toAreaLabel(parentType: string | undefined, slot: string): string {
  if (parentType === undefined) {
    return "Page body";
  }
  const words = humanizeFieldPath(slot);
  return `${parentType} ${words.charAt(0).toLowerCase()}${words.slice(1)}`;
}
