"use client";

import type { Overrides, PuckApi } from "@measured/puck";
import type { RefObject } from "react";
import type { PaletteGroup } from "../nubbin/paletteGroup.types";
import type { PublishOutcome } from "../nubbin/publishOutcome.types";
import { BlockPalette } from "./BlockPalette";
import { FieldsWithCallout } from "./FieldsWithCallout";
import { IssuesPill } from "./IssuesPill";
import { PublishControl } from "./PublishControl";
import { PuckApiBridge } from "./PuckApiBridge";
import { RouteSwitcher } from "./RouteSwitcher";

/**
 * The studio's Puck overrides. The whole-UI `puck` override renders its children untouched
 * with the API bridge beside them, which is the one supported place a component can sit
 * inside Puck's provider. `headerActions` drops the children Puck hands it — Puck 0.20.2's
 * own header Publish control renders as a `div` with a click handler, which a keyboard
 * cannot reliably reach or press — and renders the studio's chrome instead: the Pages
 * switcher naming the document being edited, the issues pill with its dropdown, then the
 * split publish control, which owns the publish call and its in-panel report and hands
 * refusals and rollback outcomes up through `onOutcome`. `fields` tops the inspector with
 * the selected block's docs links and its callout. The editor memoises the result — the
 * ref, callback, route and lists are stable per page load — so Puck never sees a new overrides object per
 * keystroke; everything that changes underneath (the pill's count, the publish label, the
 * callout) flows through the editor status store instead. `drawer` drops Puck's own block
 * list and renders the studio's palette — search, described blocks, detail bar — whose
 * rows are still Puck's `Drawer.Item`, so dragging stays Puck's.
 */
export function toBridgedOverrides(
  apiRef: RefObject<(() => PuckApi) | undefined>,
  pages: { route: string; routes: readonly string[] },
  onOutcome: (outcome: PublishOutcome) => void,
  palette: readonly PaletteGroup[],
  docsByBlock: Record<string, Record<string, string>>,
): Partial<Overrides> {
  return {
    drawer: () => <BlockPalette groups={palette} />,
    headerActions: () => (
      <>
        <RouteSwitcher route={pages.route} routes={pages.routes} />
        <IssuesPill apiRef={apiRef} />
        <PublishControl route={pages.route} onOutcome={onOutcome} />
      </>
    ),
    fields: ({ children }) => (
      <FieldsWithCallout docsByBlock={docsByBlock}>{children}</FieldsWithCallout>
    ),
    puck: ({ children }) => (
      <>
        <PuckApiBridge apiRef={apiRef} />
        {children}
      </>
    ),
  };
}
