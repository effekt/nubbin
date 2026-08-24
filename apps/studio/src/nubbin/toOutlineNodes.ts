import type { SlotConstraint } from "@nubbin/core";
import { isPuckSlotValue } from "./isPuckSlotValue";
import type { OutlineNode } from "./outlineNode.types";
import type { PuckComponentData } from "./puckData.types";

/**
 * The outline's tree, from Puck's data and the registry's slot declarations: each block
 * with its declared areas in declaration order, each area with the blocks inside it and
 * the slot's `max` where one is declared. An area the document has not filled still
 * renders — empty, so the author sees the spot exists — and a slot value that does not
 * read as components counts as empty rather than guessing.
 */
export function toOutlineNodes(
  content: readonly PuckComponentData[],
  slotsByBlock: Record<string, Record<string, SlotConstraint>>,
): OutlineNode[] {
  return content.map((node) => ({
    id: node.props.id,
    type: node.type,
    areas: Object.entries(slotsByBlock[node.type] ?? {}).map(([name, constraint]) => {
      const value = node.props[name];
      return {
        name,
        max: constraint.max,
        children: toOutlineNodes(isPuckSlotValue(value) ? value : [], slotsByBlock),
      };
    }),
  }));
}
