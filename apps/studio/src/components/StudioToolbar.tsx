"use client";

import "./studioToolbar.css";
import type { ReactNode } from "react";
import { RouteSwitcher } from "./RouteSwitcher";
import { SidebarToggle } from "./SidebarToggle";
import { ToolbarDocName } from "./ToolbarDocName";
import { UndoRedo } from "./UndoRedo";
import { ViewportSeg } from "./ViewportSeg";

interface StudioToolbarProps {
  route: string;
  routes: readonly string[];
  /** The right-edge controls Puck hands the header — the studio's own, via `headerActions`. */
  actions: ReactNode;
}

/** The whole header, replacing Puck's through the `header` override in the specimen's
 * arrangement: Pages control, the document's name with its route pill, then — right of the
 * spacer — viewport chips, undo and redo, and the publish-side controls. The stock header's
 * sidebar toggles survive as the flanking icon buttons; its mobile menu collapse does not,
 * so at narrow widths the row wraps instead of folding. */
export function StudioToolbar({ route, routes, actions }: StudioToolbarProps) {
  return (
    <section className="nb-toolbar" aria-label="Studio toolbar">
      <SidebarToggle side="left" />
      <RouteSwitcher route={route} routes={routes} />
      <span className="nb-tb-sep" aria-hidden="true" />
      <ToolbarDocName route={route} />
      <span className="nb-tb-spacer" />
      <ViewportSeg />
      <span className="nb-tb-sep" aria-hidden="true" />
      <UndoRedo />
      <span className="nb-tb-sep" aria-hidden="true" />
      {actions}
      <SidebarToggle side="right" />
    </section>
  );
}
