"use client";

import { Drawer } from "@measured/puck";
import type { PaletteBlock } from "../nubbin/paletteGroup.types";

/** One draggable row of the palette: Puck's own `Drawer.Item`, so dragging into the canvas
 * is Puck's to run, wrapped only to tell the detail bar what is being pointed at. Focus
 * bubbles from the item Puck makes focusable, so keyboard travel reads the same detail. */
export function PaletteItem({
  block,
  onDetail,
}: {
  block: PaletteBlock;
  onDetail: (next: PaletteBlock | undefined) => void;
}) {
  return (
    // The interactive element is Puck's focusable, draggable item inside; these handlers
    // only observe hover and bubbled focus for the detail bar, and the focus that already
    // triggers them is the keyboard path.
    // biome-ignore lint/a11y/noStaticElementInteractions: hover/focus observers, not interaction
    <div
      className="nb-palette-item"
      onMouseEnter={() => onDetail(block)}
      onMouseLeave={() => onDetail(undefined)}
      onFocus={() => onDetail(block)}
      onBlur={() => onDetail(undefined)}
    >
      <Drawer.Item name={block.name} />
    </div>
  );
}
