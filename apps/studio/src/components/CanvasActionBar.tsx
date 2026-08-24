"use client";

import { ActionBar } from "@measured/puck";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * The `actionBar` override, splitting Puck's one bar into the specimen's two overlays: the
 * white actions chip keeps the bar's own top-right berth, and the block's name escapes it —
 * portalled to the overlay root Puck positions over the block, where canvasOverlay.css
 * hangs it astride the top-left edge as the rust name tag. The overlay root is found from
 * the rendered chip, so a Puck upgrade that renames it degrades to a one-pill bar, never to
 * a tag adrift.
 */
export function CanvasActionBar({
  label,
  parentAction,
  children,
}: {
  label?: string | undefined;
  parentAction: ReactNode;
  children: ReactNode;
}) {
  const chip = useRef<HTMLDivElement>(null);
  const [overlay, setOverlay] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setOverlay(chip.current?.closest<HTMLElement>("[data-puck-overlay]") ?? null);
  }, []);
  return (
    <div ref={chip} className="nb-ov-chip">
      <ActionBar>
        <ActionBar.Group>
          {parentAction}
          {children}
        </ActionBar.Group>
      </ActionBar>
      {label !== undefined && overlay !== null
        ? createPortal(<span className="nb-ov-tag">{label}</span>, overlay)
        : null}
    </div>
  );
}
