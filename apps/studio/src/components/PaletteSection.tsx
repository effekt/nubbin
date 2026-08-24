"use client";

import { Drawer } from "@measured/puck";
import type { PaletteBlock, PaletteGroup } from "../nubbin/paletteGroup.types";
import { PaletteItem } from "./PaletteItem";

/** One category of the palette: a disclosure header — a real button carrying
 * `aria-expanded`, spanning the row with the chevron, the category name and the count of
 * blocks currently listed (the filtered count, while a search narrows; still visible
 * collapsed, so a closed section says what it holds). Open, the rows render in Puck's
 * drawer, which is what makes them draggable; collapsed, they unmount, which is what makes
 * a large catalog's palette compact. An `h3` under the card's own `h2`, "Blocks". */
export function PaletteSection({
  group,
  onDetail,
  onInsert,
  open,
  onToggle,
}: {
  group: PaletteGroup;
  onDetail: (next: PaletteBlock | undefined) => void;
  onInsert: (block: PaletteBlock) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="nb-palette-section">
      <h3 className="nb-palette-heading">
        <button
          type="button"
          className="nb-palette-heading-toggle"
          aria-expanded={open}
          onClick={onToggle}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="m2 3.5 3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {group.title}
          <span className="nb-palette-count">{group.blocks.length}</span>
        </button>
      </h3>
      {open ? (
        <div className="nb-palette-section-body">
          <Drawer>
            {group.blocks.map((block) => (
              <PaletteItem key={block.name} block={block} onDetail={onDetail} onInsert={onInsert} />
            ))}
          </Drawer>
        </div>
      ) : null}
    </section>
  );
}
