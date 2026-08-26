"use client";

import "./studioToolbar.css";
import type { ReactNode } from "react";
import { SidebarToggle } from "./SidebarToggle";
import type { StudioViewport } from "./studioConfig.types";
import { UndoRedo } from "./UndoRedo";
import { ViewportSeg } from "./ViewportSeg";

export interface StudioToolbarProps {
  navigation: ReactNode;
  document: ReactNode;
  viewports: readonly StudioViewport[];
  /** The right-edge controls Puck hands the header — the studio's own, via `headerActions`. */
  actions: ReactNode;
}

/** The whole header, replacing Puck's through the `header` override in the specimen's
 * arrangement: Pages control, the document's name with its route pill, then — right of the
 * spacer — viewport chips, undo and redo, and the publish-side controls. The stock header's
 * sidebar toggles survive as the flanking icon buttons; its mobile menu collapse does not,
 * so at narrow widths the row wraps instead of folding. */
export function StudioToolbar({ navigation, document, viewports, actions }: StudioToolbarProps) {
  return (
    <section className="nb-toolbar" aria-label="Studio toolbar">
      <SidebarToggle side="left" />
      {navigation}
      <span className="nb-tb-sep" aria-hidden="true" />
      {document}
      <span className="nb-tb-spacer" />
      <ViewportSeg viewports={viewports} />
      <span className="nb-tb-sep" aria-hidden="true" />
      <UndoRedo />
      <span className="nb-tb-sep" aria-hidden="true" />
      {actions}
      <SidebarToggle side="right" />
    </section>
  );
}
