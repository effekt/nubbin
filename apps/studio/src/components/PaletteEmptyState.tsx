"use client";

/** What the palette says when the search matches nothing: which query came up empty, and
 * the one action that brings the blocks back. */
export function PaletteEmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="nb-palette-empty">
      <p>No blocks match &ldquo;{query.trim()}&rdquo;.</p>
      <button type="button" onClick={onClear}>
        Clear search
      </button>
    </div>
  );
}
