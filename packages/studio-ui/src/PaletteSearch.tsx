"use client";

/** The palette's live filter, sitting inline beside the card's title: a labelled search
 * input with the magnifier inside its left edge, quoting how many blocks it searches. The
 * magnifier is decorative — the label carries the meaning. */
export function PaletteSearch({
  query,
  total,
  onChange,
}: {
  query: string;
  total: number;
  onChange: (next: string) => void;
}) {
  return (
    <div className="nb-palette-search">
      <svg
        className="nb-palette-search-mag"
        aria-hidden="true"
        viewBox="0 0 14 14"
        width="13"
        height="13"
        fill="none"
      >
        <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m9.2 9.2 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={query}
        placeholder={`Search ${total} blocks…`}
        aria-label="Search blocks"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
