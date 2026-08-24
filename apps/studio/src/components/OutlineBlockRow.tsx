"use client";

import type { OutlineNode } from "../nubbin/outlineNode.types";
import { DisclosureChevron } from "./DisclosureChevron";
import { PaletteIcon } from "./PaletteIcon";

/** One block's row in the outline: the same glyph the palette draws for it, its name, and
 * — where the block declares areas — the disclosure chevron that folds them. Clicking
 * selects the block in the editor; the chevron slot renders empty for a leaf so rows stay
 * aligned. */
export function OutlineBlockRow({
  node,
  icon,
  isOpen,
  isSelected,
  onSelect,
  onToggle,
}: {
  node: OutlineNode;
  icon: string | undefined;
  isOpen: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="nb-outline-row nb-outline-block" aria-current={isSelected ? "true" : undefined}>
      {node.areas.length === 0 ? (
        <span className="nb-outline-chevron" aria-hidden="true" />
      ) : (
        <button
          type="button"
          className="nb-outline-chevron"
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${node.type}`}
          onClick={onToggle}
        >
          <DisclosureChevron />
        </button>
      )}
      <button type="button" className="nb-outline-name" onClick={onSelect}>
        <span className="nb-outline-glyph" aria-hidden="true">
          <PaletteIcon icon={icon} />
        </span>
        {node.type}
      </button>
    </div>
  );
}
