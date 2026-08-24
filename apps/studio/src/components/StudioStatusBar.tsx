"use client";

import "./studioStatusBar.css";
import { toStatusSegments } from "./toStatusSegments";
import { useEditorStatus } from "./useEditorStatus";

/** The strip under the canvas, the specimen's page status: publish state behind its dot,
 * the fix count while issues stand, the autosave note right-aligned — each segment shown
 * only while the editor status can prove it. Rendered beside `<Puck>` inside the studio's
 * token scope, and fixed to the viewport's foot in the room the layout leaves it. */
export function StudioStatusBar() {
  const { left, right } = toStatusSegments(useEditorStatus());
  return (
    <section className="nb-statusbar" aria-label="Page status">
      {left.map((segment) => (
        <span key={segment.text} className={`nb-statusbar-item nb-statusbar-${segment.kind}`}>
          {segment.kind === "plain" ? null : (
            <span
              className={`nb-statusbar-dot nb-statusbar-dot-${segment.kind}`}
              aria-hidden="true"
            />
          )}
          {segment.text}
        </span>
      ))}
      <span className="nb-statusbar-right">
        {right.map((segment) => (
          <span key={segment.text} className="nb-statusbar-item">
            {segment.text}
          </span>
        ))}
      </span>
    </section>
  );
}
