"use client";

import type { Overrides, PuckApi } from "@measured/puck";
import type { SlotConstraint } from "@nubbin/core";
import type { PaletteGroup, PublishOutcome, StudioOperations } from "@nubbin/studio";
import { toIconByBlock } from "@nubbin/studio";
import {
  BlockPalette,
  CanvasActionBar,
  FieldsWithCallout,
  FrameLoadedProbe,
  IssuesPill,
  PublishControl,
  PuckApiBridge,
  RouteSwitcher,
  StudioOutline,
  StudioToolbar,
  type StudioViewport,
  ToolbarDocument,
} from "@nubbin/studio-ui";
import type { RefObject } from "react";
import { goToEditor } from "../nubbin/goToEditor";
import { prefixedRoute } from "../nubbin/prefixedRoute";
import { titleFromRoute } from "../nubbin/titleFromRoute";

/**
 * The studio's Puck overrides. The whole-UI `puck` override renders its children untouched
 * with the API bridge beside them, which is the one supported place a component can sit
 * inside Puck's provider. `header` replaces the stock header wholesale with the specimen's
 * toolbar — Pages control, doc name and route pill, viewport chips, undo/redo — keeping the
 * stock header's sidebar toggles as its flanking buttons and re-mounting the `actions` Puck
 * hands through. Those actions are `headerActions`, which drops the children Puck hands it
 * — Puck 0.20.2's own header Publish control renders as a `div` with a click handler, which
 * a keyboard cannot reliably reach or press — and renders the studio's right edge instead:
 * the Preview link, the issues pill with its dropdown, then the split publish control,
 * which owns the publish call and its in-panel report and hands refusals and rollback
 * outcomes up through `onOutcome`. `fields` arranges the inspector as the specimen's —
 * head, scrolling body with the selected block's docs links and its callout, foot. The
 * editor memoises the result — the ref, callback, route and lists are stable per page load
 * — so Puck never sees a new overrides object per keystroke; everything that changes
 * underneath (the pill's count, the publish label, the callout) flows through the editor
 * status store instead. `drawer` drops Puck's own block list and renders the studio's
 * palette — search, described blocks, detail bar — whose rows are still Puck's
 * `Drawer.Item`, so dragging stays Puck's. `outline` drops Puck's layer tree for the
 * studio's — the same glyphs as the palette, area rows with fullness chips — selecting
 * through the same store Puck's tree used.
 */
export function toBridgedOverrides(
  apiRef: RefObject<(() => PuckApi) | undefined>,
  pages: { route: string; routes: readonly string[] },
  viewports: readonly StudioViewport[],
  operations: StudioOperations,
  onOutcome: (outcome: PublishOutcome) => void,
  palette: readonly PaletteGroup[],
  docsByBlock: Record<string, Record<string, string>>,
  slotsByBlock: Record<string, Record<string, SlotConstraint>>,
): Partial<Overrides> {
  const icons = toIconByBlock(palette);
  return {
    actionBar: ({ label, parentAction, children }) => (
      <CanvasActionBar label={label} parentAction={parentAction}>
        {children}
      </CanvasActionBar>
    ),
    iframe: ({ document, children }) => (
      <FrameLoadedProbe document={document}>{children}</FrameLoadedProbe>
    ),
    drawer: () => (
      <BlockPalette
        groups={palette}
        apiRef={apiRef}
        previewHref={(name) => prefixedRoute("/block-preview", `/${name}`)}
      />
    ),
    outline: () => <StudioOutline icons={icons} slotsByBlock={slotsByBlock} />,
    header: ({ actions }) => (
      <StudioToolbar
        navigation={
          <RouteSwitcher
            route={pages.route}
            routes={pages.routes}
            hrefForRoute={(route) => prefixedRoute("/edit", route)}
            createRoute={operations.createRoute}
            onCreated={goToEditor}
          />
        }
        document={
          <ToolbarDocument route={pages.route} fallbackTitle={titleFromRoute(pages.route)} />
        }
        viewports={viewports}
        actions={actions}
      />
    ),
    headerActions: () => (
      <>
        <a className="nb-toolbar-preview" href={prefixedRoute("/preview", pages.route)}>
          Preview
        </a>
        <IssuesPill apiRef={apiRef} />
        <PublishControl route={pages.route} operations={operations} onOutcome={onOutcome} />
      </>
    ),
    fields: ({ children }) => (
      <FieldsWithCallout docsByBlock={docsByBlock} icons={icons}>
        {children}
      </FieldsWithCallout>
    ),
    puck: ({ children }) => (
      <>
        <PuckApiBridge apiRef={apiRef} />
        {children}
      </>
    ),
  };
}
