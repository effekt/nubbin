"use client";

/** The specimen's 9px disclosure chevron, pointing down at rest; the caller's CSS rotates
 * it -90° when its disclosure is closed. Decoration only — the button around it carries
 * `aria-expanded`. */
export function DisclosureChevron() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="m2 3.5 3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
