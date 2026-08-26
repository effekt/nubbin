"use client";

import "./studioStatusBar.css";
import { StatusItems } from "./StatusItems";
import { AUTOSAVE_SETTLE_MS } from "./studioStatusBar.constants";
import { toStatusSegments } from "./toStatusSegments";
import { useEditorStatus } from "./useEditorStatus";
import { useStaleAfter } from "./useStaleAfter";

/** The strip under the canvas, the specimen's page status: publish state behind its dot,
 * the fix count while issues stand, and — right-aligned — the autosave note, saying "just
 * now" only while that is true, beside the preview's proven state. Each segment is shown
 * only while the editor status can prove it. Rendered beside `<Puck>` inside the studio's
 * token scope, and fixed to the viewport's foot in the room the layout leaves it. */
export function StudioStatusBar() {
  const status = useEditorStatus();
  const saveStale = useStaleAfter(status.savedAt, AUTOSAVE_SETTLE_MS);
  const { left, right } = toStatusSegments(status, saveStale);
  return (
    <section className="nb-statusbar" aria-label="Page status">
      <StatusItems segments={left} />
      <span className="nb-statusbar-right">
        <StatusItems segments={right} />
      </span>
    </section>
  );
}
