"use client";

import { usePuck } from "@measured/puck";
import studioConfig from "@nubbin/studio-config";

/** The toolbar's viewport chips, the specimen's segmented row over the consumer's own
 * breakpoints: each chip sets the canvas width through Puck's public `setUi`, and the
 * canvas re-zooms itself exactly as it does for its own controls. The pressed chip is told
 * by `aria-pressed` and shown by fill and weight, never hue alone. */
export function ViewportSeg() {
  const { appState, dispatch } = usePuck();
  const viewports = appState.ui.viewports;
  return (
    <fieldset className="nb-tb-seg" aria-label="Canvas width">
      {studioConfig.viewports.map((viewport) => (
        <button
          key={viewport.width}
          type="button"
          // Puck picks the starting viewport on the client from the window's own width, so
          // the pressed chip legitimately differs from the server's render until then.
          suppressHydrationWarning
          aria-pressed={viewport.width === viewports.current.width}
          onClick={() =>
            dispatch({
              type: "setUi",
              ui: {
                viewports: {
                  ...viewports,
                  current: { width: viewport.width, height: viewport.height ?? "auto" },
                },
              },
            })
          }
        >
          {viewport.label}
        </button>
      ))}
    </fieldset>
  );
}
