"use client";

import { areaChipLabel } from "./areaChipLabel";
import { DisclosureChevron } from "./DisclosureChevron";
import type { OutlineArea } from "./outlineNode.types";

interface OutlineAreaRowProps {
  area: OutlineArea;
  isOpen: boolean;
  onToggle: () => void;
}

/** One area's row in the outline: the slot's name in the small-caps voice behind the brass
 * bracket glyph, with the fullness chip — how many blocks it holds, against the bound the
 * schema declares where there is one. The row is the disclosure for the blocks inside. */
export function OutlineAreaRow({ area, isOpen, onToggle }: OutlineAreaRowProps) {
  return (
    <div className="nb-outline-row nb-outline-area">
      <button
        type="button"
        className="nb-outline-area-toggle"
        aria-expanded={isOpen}
        onClick={onToggle}
        disabled={area.children.length === 0}
      >
        <span className="nb-outline-chevron" aria-hidden="true">
          {area.children.length === 0 ? null : <DisclosureChevron />}
        </span>
        <span className="nb-outline-bracket" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M4 1.5H2.5a1 1 0 0 0-1 1V4M8 1.5h1.5a1 1 0 0 1 1 1V4M4 10.5H2.5a1 1 0 0 1-1-1V8M8 10.5h1.5a1 1 0 0 0 1-1V8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {area.name}
        <span className="nb-outline-chip">{areaChipLabel(area.children.length, area.max)}</span>
      </button>
    </div>
  );
}
