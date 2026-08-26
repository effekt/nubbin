"use client";

import { usePuck } from "@measured/puck";
import { HistoryButton } from "./HistoryButton";

/** The toolbar's undo and redo pair, on Puck's own history — the same edits ctrl+z walks.
 * Each button disables when its direction has nowhere to go, so the state is told to
 * assistive tech and shown by the dimmed glyph alike. */
export function UndoRedo() {
  const { history } = usePuck();
  return (
    <>
      <HistoryButton
        label="Undo"
        disabled={!history.hasPast}
        onClick={() => history.back()}
        path="M5.5 3 2.5 6l3 3M3 6h6a3.5 3.5 0 0 1 0 7H7"
      />
      <HistoryButton
        label="Redo"
        disabled={!history.hasFuture}
        onClick={() => history.forward()}
        path="m9.5 3 3 3-3 3M12 6H6a3.5 3.5 0 0 0 0 7h2"
      />
    </>
  );
}
