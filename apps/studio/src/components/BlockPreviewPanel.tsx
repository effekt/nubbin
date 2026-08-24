"use client";

import { type RefObject, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { PaletteBlock } from "../nubbin/paletteGroup.types";
import {
  PREVIEW_HEADER_ALLOWANCE_PX,
  PREVIEW_PANEL_GAP_PX,
  PREVIEW_PANEL_WIDTH_PX,
  PREVIEW_RENDER_WIDTH_PX,
} from "./blockPreviewPanel.constants";
import { frameContentHeight } from "./frameContentHeight";
import { toPreviewFrameHeight } from "./toPreviewFrameHeight";

/** The floating preview beside the Blocks card: the block's name and full description as
 * the header — the one place the description never truncates — over an iframe of
 * `/block-preview/<name>`, rendered at a real page width and scaled to the panel. The
 * region below the header fits the measured content, so a short block reads as a compact
 * card. Portalled to `body` and positioned outside the card's right edge — it never covers
 * a palette row — and inert throughout: `pointer-events: none` in the stylesheet,
 * `aria-hidden` here, because the palette's live region already speaks the description.
 * The iframe element persists while the pointer moves between rows; only `src` swaps, and
 * the browser's HTTP cache is what makes a revisit cheap. */
export function BlockPreviewPanel({
  block,
  anchor,
}: {
  block: PaletteBlock | undefined;
  anchor: RefObject<HTMLElement | null>;
}) {
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const name = block?.name;
  // A fresh document is about to load; holding the last block's height would size this one.
  useEffect(() => setContentHeight(undefined), [name]);
  const card = anchor.current?.getBoundingClientRect();
  if (block === undefined || card === undefined) {
    return null;
  }
  const scale = PREVIEW_PANEL_WIDTH_PX / PREVIEW_RENDER_WIDTH_PX;
  const frameHeight = toPreviewFrameHeight(contentHeight, scale, window.innerHeight);
  const top = Math.max(
    PREVIEW_PANEL_GAP_PX,
    Math.min(
      card.top,
      window.innerHeight - frameHeight - PREVIEW_HEADER_ALLOWANCE_PX - PREVIEW_PANEL_GAP_PX,
    ),
  );
  return createPortal(
    // The portal lands on `body`, outside the editor's token scope — without this wrapper
    // (`display: contents`, so it is scope and nothing else) every `--nb-*` the panel
    // paints with would resolve to nothing and the card would render transparent.
    <div className="nubbin-studio" aria-hidden="true">
      <div
        className="nb-palette-preview"
        style={{ top, left: card.right + PREVIEW_PANEL_GAP_PX, width: PREVIEW_PANEL_WIDTH_PX }}
      >
        <header className="nb-palette-preview-header">
          <strong>{block.name}</strong>
          {block.description === undefined ? null : <p>{block.description}</p>}
        </header>
        <div className="nb-palette-preview-frame" style={{ height: frameHeight }}>
          <iframe
            src={`/block-preview/${block.name}`}
            title={`Preview of the ${block.name} block`}
            tabIndex={-1}
            onLoad={(event) => setContentHeight(frameContentHeight(event.currentTarget))}
            style={{
              width: PREVIEW_RENDER_WIDTH_PX,
              height: contentHeight ?? frameHeight / scale,
              transform: `scale(${scale})`,
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
