"use client";

import type { PaletteBlock } from "@nubbin/studio";

/** The card's reserved footer strip: one fixed-height instructional line that never reacts
 * to hover — the list above must not move a pixel as the pointer travels rows, so nothing
 * here grows. The pointed-at block's name and description still reach assistive tech
 * through the visually hidden live region beside the hint: the hover preview panel is
 * `aria-hidden`, making this the one copy a screen reader is handed. The clip pattern
 * rather than `display: none`, because a hidden live region announces nothing. */
export function PaletteDetailBar({ block }: { block: PaletteBlock | undefined }) {
  return (
    <div className="nb-palette-detail">
      <p className="nb-palette-detail-hint">
        Drag a block in, or press Enter to add it at the selection.
      </p>
      <p className="nb-palette-detail-live" aria-live="polite">
        {block === undefined
          ? ""
          : `${block.name}${block.description === undefined ? "" : ` — ${block.description}`}`}
      </p>
    </div>
  );
}
