"use client";

import type { Overrides, PuckApi } from "@measured/puck";
import type { RefObject } from "react";
import { PuckApiBridge } from "./PuckApiBridge";

/**
 * Puck overrides that change nothing visible: the whole-UI `puck` override renders its
 * children untouched with the API bridge beside them, which is the one supported place a
 * component can sit inside Puck's provider. The editor memoises the result once — the ref
 * is stable — so Puck never sees a new overrides object per keystroke.
 */
export function toBridgedOverrides(
  apiRef: RefObject<(() => PuckApi) | undefined>,
): Partial<Overrides> {
  return {
    puck: ({ children }) => (
      <>
        <PuckApiBridge apiRef={apiRef} />
        {children}
      </>
    ),
  };
}
