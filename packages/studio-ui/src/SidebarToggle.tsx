"use client";

import { usePuck } from "@measured/puck";

interface SidebarToggleProps {
  side: "left" | "right";
}

/** One sidebar's show/hide toggle, standing in for the pair Puck's stock header carried —
 * the same `setUi` flag, through the public dispatch. The pressed state says whether the
 * panel is showing. */
export function SidebarToggle({ side }: SidebarToggleProps) {
  const { appState, dispatch } = usePuck();
  const visible =
    side === "left" ? appState.ui.leftSideBarVisible : appState.ui.rightSideBarVisible;
  return (
    <button
      type="button"
      className="nb-tb-icon"
      aria-pressed={visible}
      aria-label={side === "left" ? "Toggle blocks sidebar" : "Toggle inspector sidebar"}
      onClick={() =>
        dispatch({
          type: "setUi",
          ui:
            side === "left" ? { leftSideBarVisible: !visible } : { rightSideBarVisible: !visible },
        })
      }
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <rect
          x="1.5"
          y="2.5"
          width="12"
          height="10"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {side === "left" ? (
          <path d="M5.5 2.5v10" stroke="currentColor" strokeWidth="1.5" />
        ) : (
          <path d="M9.5 2.5v10" stroke="currentColor" strokeWidth="1.5" />
        )}
      </svg>
    </button>
  );
}
