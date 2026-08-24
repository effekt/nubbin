"use client";

import { Drawer } from "@measured/puck";
import type { PaletteBlock, PaletteGroup } from "../nubbin/paletteGroup.types";
import { PaletteItem } from "./PaletteItem";

/** One category of the palette: a disclosure header — a real button carrying
 * `aria-expanded`, with the chevron and the category name — beside the count of blocks
 * currently listed (the filtered count, while a search narrows; still visible collapsed,
 * so a closed section says what it holds). Open, the rows render in Puck's drawer, which
 * is what makes them draggable; collapsed, they unmount, which is what makes a large
 * catalog's palette compact. */
export function PaletteSection({
  group,
  onDetail,
  open,
  onToggle,
}: {
  group: PaletteGroup;
  onDetail: (next: PaletteBlock | undefined) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="nb-palette-section">
      <h2 className="nb-palette-heading">
        <button
          type="button"
          className="nb-palette-heading-toggle"
          aria-expanded={open}
          onClick={onToggle}
        >
          <span className="nb-palette-chevron" aria-hidden="true">
            ▾
          </span>
          {group.title}
        </button>
        <span className="nb-palette-count">{group.blocks.length}</span>
      </h2>
      {open ? (
        <Drawer>
          {group.blocks.map((block) => (
            <PaletteItem key={block.name} block={block} onDetail={onDetail} />
          ))}
        </Drawer>
      ) : null}
    </section>
  );
}
