"use client";

import { Drawer } from "@measured/puck";
import type { PaletteBlock } from "../nubbin/paletteGroup.types";
import "./paletteItem.css";
import { PaletteIcon } from "./PaletteIcon";

/** One draggable row of the palette: Puck's own `Drawer.Item`, so dragging into the canvas
 * is Puck's to run, wrapped to tell the detail bar what is being pointed at and to hand
 * Enter to the palette's insert — the keyboard's way in, since Puck's item drags only by
 * pointer. Focus bubbles from the item Puck makes focusable, so keyboard travel reads the
 * same detail. */
export function PaletteItem({
  block,
  onDetail,
  onInsert,
}: {
  block: PaletteBlock;
  onDetail: (next: PaletteBlock | undefined) => void;
  onInsert: (block: PaletteBlock) => void;
}) {
  return (
    // The interactive element is Puck's focusable, draggable item inside; these handlers
    // observe hover and bubbled focus for the detail bar, and catch the Enter that item
    // ignores — the focus that already triggers them is the keyboard path.
    // biome-ignore lint/a11y/noStaticElementInteractions: hover/focus observers around Puck's own button-role item
    <div
      className="nb-palette-item"
      onMouseEnter={() => onDetail(block)}
      onMouseLeave={() => onDetail(undefined)}
      onFocus={() => onDetail(block)}
      onBlur={() => onDetail(undefined)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onInsert(block);
        }
      }}
    >
      <Drawer.Item name={block.name}>
        {({ children }) => (
          <div className="nb-palette-item-row">
            {/* Decoration beside the name Puck already renders; a block without an icon
             * keeps the fixed-width span so rows stay aligned. */}
            <span className="nb-palette-item-icon" aria-hidden="true">
              <PaletteIcon icon={block.icon} />
            </span>
            {children}
          </div>
        )}
      </Drawer.Item>
    </div>
  );
}
