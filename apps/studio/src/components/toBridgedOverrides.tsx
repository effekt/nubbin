"use client";

import type { Overrides, PuckApi } from "@measured/puck";
import type { RefObject } from "react";
import { PublishButton } from "./PublishButton";
import { PuckApiBridge } from "./PuckApiBridge";
import { RouteSwitcher } from "./RouteSwitcher";

/**
 * The studio's Puck overrides. The whole-UI `puck` override renders its children untouched
 * with the API bridge beside them, which is the one supported place a component can sit
 * inside Puck's provider. `headerActions` drops the children Puck hands it — Puck 0.20.2's
 * own header Publish control renders as a `div` with a click handler, which a keyboard
 * cannot reliably reach or press — and renders the studio's chrome instead: the Pages
 * switcher naming the document being edited, then the `button` wired to the same publish
 * flow. The editor memoises the result — the ref, callback, route and list are stable per
 * page load — so Puck never sees a new overrides object per keystroke.
 */
export function toBridgedOverrides(
  apiRef: RefObject<(() => PuckApi) | undefined>,
  onPublish: () => void,
  pages: { route: string; routes: readonly string[] },
): Partial<Overrides> {
  return {
    headerActions: () => (
      <>
        <RouteSwitcher route={pages.route} routes={pages.routes} />
        <PublishButton onPublish={onPublish} />
      </>
    ),
    puck: ({ children }) => (
      <>
        <PuckApiBridge apiRef={apiRef} />
        {children}
      </>
    ),
  };
}
