"use client";

import { Drawer } from "@measured/puck";
import type { PaletteBlock, PaletteGroup } from "../nubbin/paletteGroup.types";
import { PaletteItem } from "./PaletteItem";

/** One category of the palette: its header with the count of blocks currently listed —
 * the filtered count, while a search narrows — and the rows themselves in Puck's drawer,
 * which is what makes them draggable. */
export function PaletteSection({
  group,
  onDetail,
}: {
  group: PaletteGroup;
  onDetail: (next: PaletteBlock | undefined) => void;
}) {
  return (
    <section className="nb-palette-section">
      <h2 className="nb-palette-heading">
        {group.title}
        <span className="nb-palette-count">{group.blocks.length}</span>
      </h2>
      <Drawer>
        {group.blocks.map((block) => (
          <PaletteItem key={block.name} block={block} onDetail={onDetail} />
        ))}
      </Drawer>
    </section>
  );
}
