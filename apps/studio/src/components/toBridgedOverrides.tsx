"use client";

import type { Overrides, PuckApi } from "@measured/puck";
import type { RefObject } from "react";
import { PublishButton } from "./PublishButton";
import { PuckApiBridge } from "./PuckApiBridge";

/**
 * The studio's Puck overrides. The whole-UI `puck` override renders its children untouched
 * with the API bridge beside them, which is the one supported place a component can sit
 * inside Puck's provider. `headerActions` drops the children Puck hands it — Puck 0.20.2's
 * own header Publish control renders as a `div` with a click handler, which a keyboard
 * cannot reliably reach or press — and renders the studio's `button` wired to the same
 * publish flow instead. The editor memoises the result — the ref and callback are stable —
 * so Puck never sees a new overrides object per keystroke.
 */
export function toBridgedOverrides(
  apiRef: RefObject<(() => PuckApi) | undefined>,
  onPublish: () => void,
): Partial<Overrides> {
  return {
    headerActions: () => <PublishButton onPublish={onPublish} />,
    puck: ({ children }) => (
      <>
        <PuckApiBridge apiRef={apiRef} />
        {children}
      </>
    ),
  };
}
