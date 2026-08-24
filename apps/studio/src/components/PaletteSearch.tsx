"use client";

/** The palette's live filter: a labelled search input under the card's title, narrowing the
 * list on every keystroke. The magnifier is decorative — the label carries the meaning. */
export function PaletteSearch({
  query,
  onChange,
}: {
  query: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="nb-palette-search">
      <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={query}
        placeholder="Search blocks…"
        aria-label="Search blocks"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
