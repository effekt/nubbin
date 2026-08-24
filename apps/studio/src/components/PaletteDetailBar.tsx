"use client";

import type { PaletteBlock } from "../nubbin/paletteGroup.types";

/** The one-line footer pinned to the Blocks card: the hovered or focused block's name and
 * description, or a hint while nothing is pointed at. Polite live region, so a screen
 * reader hears the description the same moment a sighted reader sees it. */
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
