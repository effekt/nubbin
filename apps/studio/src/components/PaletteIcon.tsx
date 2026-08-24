import type { ReactElement } from "react";

const STROKE = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* Monoline glyphs in the canonical specimen's drawing style — 16-unit grid, 1.3–1.7 unit
 * strokes, `currentColor` so the palette's teal (or any later ink) is the one source of
 * colour. Plain data, not a unit: the component below is this file's one export. */
const PALETTE_ICONS: Record<string, ReactElement> = {
  hero: (
    <>
      <rect x="1.5" y="2.5" width="13" height="8" rx="1.5" {...STROKE} />
      <path d="M3.5 13h6" {...STROKE} />
    </>
  ),
  split: (
    <>
      <rect x="1.5" y="3" width="6" height="10" rx="1" {...STROKE} />
      <path d="M10 4.5h4.5M10 8h4.5M10 11.5h3" {...STROKE} />
    </>
  ),
  header: <path d="M2 4h12M2 8h8M2 12h5" {...STROKE} />,
  footer: (
    <>
      <path d="M2 3.5h12M2 6.5h8" {...STROKE} />
      <rect x="1.5" y="9.5" width="13" height="4" rx="1" {...STROKE} />
    </>
  ),
  prose: <path d="M2 3.5h12M2 7h12M2 10.5h8" {...STROKE} />,
  faq: <path d="M5.5 6a2.5 2.5 0 1 1 3.4 2.3c-.8.3-.9.9-.9 1.7M8 12.5v.2" {...STROKE} />,
  banner: <rect x="1.5" y="6" width="13" height="4" rx="1" {...STROKE} />,
  card: (
    <>
      <rect x="3" y="2" width="10" height="12" rx="1.5" {...STROKE} />
      <path d="M5.5 10h5M5.5 12h3" {...STROKE} strokeWidth={1.3} />
    </>
  ),
  grid: (
    <>
      <rect x="2" y="2" width="5" height="5" rx="1" {...STROKE} strokeWidth={1.4} />
      <rect x="9" y="2" width="5" height="5" rx="1" {...STROKE} strokeWidth={1.4} />
      <rect x="2" y="9" width="5" height="5" rx="1" {...STROKE} strokeWidth={1.4} />
      <rect x="9" y="9" width="5" height="5" rx="1" {...STROKE} strokeWidth={1.4} />
    </>
  ),
  features: <path d="M8 2.5 9.4 6.6 13.5 8 9.4 9.4 8 13.5 6.6 9.4 2.5 8 6.6 6.6Z" {...STROKE} />,
  band: (
    <>
      <circle cx="8" cy="8" r="5.5" {...STROKE} />
      <circle cx="8" cy="8" r="1.8" fill="currentColor" />
    </>
  ),
  feed: (
    <>
      <path d="M2 3.5h12M2 7h12M2 10.5h7" {...STROKE} />
      <circle cx="12.5" cy="12" r="1.5" {...STROKE} strokeWidth={1.3} />
    </>
  ),
  stack: <path d="M8 2.5 14 5.5 8 8.5 2 5.5Zm-6 6 6 3 6-3M2 11.2l6 3 6-3" {...STROKE} />,
};

/** A block's glyph in the palette: a known icon name renders the studio's monoline SVG for
 * it, and anything else — an emoji, a third-party string — renders as text, so a consumer's
 * own icon still shows. The name beside it carries the semantics; this is decoration. */
export function PaletteIcon({ icon }: { icon: string | undefined }) {
  if (icon === undefined) {
    return null;
  }
  const glyph = PALETTE_ICONS[icon];
  if (glyph === undefined) {
    return <>{icon}</>;
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {glyph}
    </svg>
  );
}
