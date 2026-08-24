import {
  PREVIEW_FRAME_LOADING_PX,
  PREVIEW_FRAME_MAX_VIEWPORT_SHARE,
} from "./blockPreviewPanel.constants";

/** The preview region's on-screen height: the iframe document's measured height scaled to
 * the panel, so a short block gets a compact card instead of a tall white field, capped at
 * a viewport share so a long page never buries the palette. Unmeasured — the iframe still
 * loading — gets the compact loading strip the panel opens at, so the region only ever
 * grows toward the content. */
export function toPreviewFrameHeight(
  contentPx: number | undefined,
  scale: number,
  viewportPx: number,
): number {
  const cap = Math.round(viewportPx * PREVIEW_FRAME_MAX_VIEWPORT_SHARE);
  if (contentPx === undefined) {
    return Math.min(PREVIEW_FRAME_LOADING_PX, cap);
  }
  return Math.min(Math.round(contentPx * scale), cap);
}
