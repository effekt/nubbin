"use client";

import type { PaletteBlock } from "../nubbin/paletteGroup.types";

/** The palette's accessible narration, visually hidden: the hovered or focused block's
 * name and full description, or a hint while nothing is pointed at. Polite live region, so
 * a screen reader hears the description the moment a sighted reader sees it in the preview
 * panel — which stays `aria-hidden`, making this the one place assistive tech reads it.
 * It was the card's visible footer until the panel took the description over; a footer
 * truncated what the panel now wraps in full. */
export function PaletteDetailBar({ block }: { block: PaletteBlock | undefined }) {
  return (
    <p className="nb-palette-detail" aria-live="polite">
      {block === undefined ? (
        "Hover a block to see what it is for."
      ) : (
        <>
          <strong>{block.name}</strong>
          {block.description === undefined ? "" : ` — ${block.description}`}
        </>
      )}
    </p>
  );
}
