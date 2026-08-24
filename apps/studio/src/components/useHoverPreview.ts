"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PaletteBlock } from "../nubbin/paletteGroup.types";
import { PREVIEW_HIDE_DELAY_MS, PREVIEW_SHOW_DELAY_MS } from "./hoverPreview.constants";

/** What the preview panel shows, derived from what the palette says is pointed at: the
 * first row waits `PREVIEW_SHOW_DELAY_MS` so travel opens nothing, an open panel swaps
 * content immediately, and leaving closes after a short grace so moving between rows
 * never blinks. `dismiss` (Escape's handler) closes it and keeps it closed until the
 * pointer reaches a different row — without that memory, a still-hovered row would
 * reopen the panel the same delay later. */
export function useHoverPreview(target: PaletteBlock | undefined): {
  preview: PaletteBlock | undefined;
  dismiss: () => void;
} {
  const [preview, setPreview] = useState<PaletteBlock | undefined>(undefined);
  const open = useRef(false);
  open.current = preview !== undefined;
  const dismissed = useRef<string | undefined>(undefined);
  const pointedAt = useRef(target);
  pointedAt.current = target;
  useEffect(() => {
    if (target === undefined) {
      const timer = setTimeout(() => setPreview(undefined), PREVIEW_HIDE_DELAY_MS);
      return () => clearTimeout(timer);
    }
    if (target.name === dismissed.current) {
      return undefined;
    }
    dismissed.current = undefined;
    if (open.current) {
      setPreview(target);
      return undefined;
    }
    const timer = setTimeout(() => setPreview(target), PREVIEW_SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [target]);
  const dismiss = useCallback(() => {
    dismissed.current = pointedAt.current?.name;
    setPreview(undefined);
  }, []);
  return { preview, dismiss };
}
