"use client";

import { ActionBar } from "@measured/puck";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./canvasOverlay.css";
import { useMirroredTransform } from "./useMirroredTransform";

const ACTIONS_CONTAINER = '[class^="_DraggableComponent-actions_"]';

/**
 * The `actionBar` override, splitting Puck's one bar into the specimen's two overlays: the
 * white actions chip keeps the bar's own top-right berth, and the block's name escapes it —
 * portalled to the overlay root Puck positions over the block, where canvasOverlay.css
 * hangs it astride the top-left edge as the rust name tag. The overlay root is found from
 * the rendered chip, so a Puck upgrade that renames it degrades to a one-pill bar, never to
 * a tag adrift. The tag mirrors the inverse-zoom transform Puck sets inline on its actions
 * container, so it holds its visual size across canvas zoom exactly as the chip does.
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
  const transform = useMirroredTransform(chip, ACTIONS_CONTAINER);
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
        ? createPortal(
            <span className="nb-ov-tag" style={{ transform }}>
              {label}
            </span>,
            overlay,
          )
        : null}
    </div>
  );
}
