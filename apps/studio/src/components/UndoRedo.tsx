"use client";

import { usePuck } from "@measured/puck";

/** The toolbar's undo and redo pair, on Puck's own history — the same edits ctrl+z walks.
 * Each button disables when its direction has nowhere to go, so the state is told to
 * assistive tech and shown by the dimmed glyph alike. */
export function UndoRedo() {
  const { history } = usePuck();
  return (
    <>
      <button
        type="button"
        className="nb-tb-icon"
        aria-label="Undo"
        disabled={!history.hasPast}
        onClick={() => history.back()}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path
            d="M5.5 3 2.5 6l3 3M3 6h6a3.5 3.5 0 0 1 0 7H7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="nb-tb-icon"
        aria-label="Redo"
        disabled={!history.hasFuture}
        onClick={() => history.forward()}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path
            d="m9.5 3 3 3-3 3M12 6H6a3.5 3.5 0 0 0 0 7h2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
