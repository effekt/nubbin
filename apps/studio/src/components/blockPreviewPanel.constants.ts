/** The width the iframe renders the block at — a real page width, so the block lays out
 * as the published page would before the panel scales it down. */
export const PREVIEW_RENDER_WIDTH_PX = 800;

/** The panel's on-screen width beside the Blocks card. */
export const PREVIEW_PANEL_WIDTH_PX = 320;

/** The compact strip the preview region opens at while the iframe is still loading — the
 * region grows to the scaled content height the moment it can be measured, never the
 * reverse. */
export const PREVIEW_FRAME_LOADING_PX = 72;

/** How much of the viewport the preview region may take. The header above it brings the
 * whole panel to roughly seven tenths of the viewport at the cap. */
export const PREVIEW_FRAME_MAX_VIEWPORT_SHARE = 0.6;

/** Vertical room assumed for the header when clamping the panel's top into the viewport.
 * The real header grows with the description, so a long one may run the cap over; the
 * frame's own cap keeps the overrun small. */
export const PREVIEW_HEADER_ALLOWANCE_PX = 84;

/** Between the card's right edge and the panel, and the margin the panel keeps from the
 * viewport's edges. */
export const PREVIEW_PANEL_GAP_PX = 12;
