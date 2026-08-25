"use client";

import { type Data, Puck, type PuckApi } from "@measured/puck";
import "@measured/puck/puck.css";
import "./puckTheme.css";
import "./canvasOverlay.css";
import type { DocumentVersion } from "@nubbin/core";
import {
  type StudioEditorConfig,
  toDocsByBlock,
  toSlotConstraintsByBlock,
  toSlotNamesByBlock,
} from "@nubbin/studio";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { foldPuckChange } from "../nubbin/foldPuckChange";
import type { PublishOutcome } from "../nubbin/publishOutcome.types";
import type { PuckData } from "../nubbin/puckData.types";
import { toAuthorIssues } from "../nubbin/toAuthorIssues";
import { toPaletteGroups } from "../nubbin/toPaletteGroups";
import { toPuckConfig } from "../nubbin/toPuckConfig";
import { ConsumerOriginContext } from "./ConsumerOriginContext";
import { editorStatusStore } from "./editorStatusStore";
import { PublishNotice } from "./PublishNotice";
import { patchEditorStatus } from "./patchEditorStatus";
import { StudioStatusBar } from "./StudioStatusBar";
import { toBridgedOverrides } from "./toBridgedOverrides";
import { useDraftSave } from "./useDraftSave";

export interface PuckEditorProps {
  config: StudioEditorConfig;
  route: string;
  routes: readonly string[];
  initialData: PuckData;
  initialVersion: DocumentVersion;
  /** The consumer app's origin, read server-side — what a link control's Open affordance
   * resolves a root-relative path against. */
  consumerOrigin: string;
}

/** The editor: stock Puck, controlled, with everything Nubbin-specific arriving through the
 * config derived from the deployment's catalog and registry. Each change folds back into a Nubbin
 * draft and posts debounced to the draft endpoint. A refusal — the save's or the publish's —
 * lands in the editor status store in author words, where the header's pill counts it and
 * its dropdown lists it; a publish refusal opens that dropdown itself. A publish that lands
 * reports inside the header's own panel — steps, timings and the live link — and a rollback
 * that lands confirms above the canvas with the route and the URL the endpoint built. */
export function PuckEditor({
  config: studioConfig,
  route,
  routes,
  initialData,
  initialVersion,
  consumerOrigin,
}: PuckEditorProps) {
  const config = useMemo(() => toPuckConfig(studioConfig.catalog, studioConfig.registry), []);
  const palette = useMemo(() => toPaletteGroups(studioConfig.catalog, studioConfig.registry), []);
  const docsByBlock = useMemo(() => toDocsByBlock(studioConfig.catalog, studioConfig.registry), []);
  const blockSlots = useMemo(() => toSlotNamesByBlock(studioConfig.registry), []);
  const slotsByBlock = useMemo(() => toSlotConstraintsByBlock(studioConfig.registry), []);
  const prior = useRef(initialVersion);
  const puckApi = useRef<(() => PuckApi) | undefined>(undefined);
  const [data, setData] = useState(initialData);
  const [outcome, setOutcome] = useState<PublishOutcome | undefined>(undefined);
  useEffect(() => {
    // A client-side route switch keeps the module alive, so the previous draft's status
    // must not carry over. First load assumes changes: the store starts unpublished.
    editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
  }, []);
  const save = useDraftSave(route);
  const onChange = (next: Data) => {
    const folded = foldPuckChange(next, prior.current, blockSlots);
    prior.current = folded.version;
    setData(folded.data);
    setOutcome(undefined);
    // The new keystrokes are not saved yet, so the autosave note stands down until the
    // debounced save lands again.
    patchEditorStatus({ published: false, savedAt: undefined });
    save(folded.version);
  };
  const dismissOutcome = useCallback(() => setOutcome(undefined), []);
  const onOutcome = useCallback((next: PublishOutcome) => {
    setOutcome(next);
    if (!next.ok) {
      patchEditorStatus({
        issues: toAuthorIssues(next.issues, studioConfig.catalog, prior.current),
        issuesOpen: true,
      });
    }
  }, []);
  const overrides = useMemo(
    () =>
      toBridgedOverrides(puckApi, { route, routes }, onOutcome, palette, docsByBlock, slotsByBlock),
    [route, routes, onOutcome, palette, docsByBlock, slotsByBlock],
  );
  return (
    <ConsumerOriginContext.Provider value={consumerOrigin}>
      <div className="nubbin-studio nb-studio-frame">
        <div className="nubbin-notices">
          {outcome?.ok === true ? (
            <PublishNotice
              route={route}
              hash={outcome.hash}
              url={outcome.url}
              onDismiss={dismissOutcome}
            />
          ) : null}
        </div>
        <Puck
          config={config}
          data={data}
          onChange={onChange}
          overrides={overrides}
          viewports={studioConfig.viewports}
        />
        <StudioStatusBar />
      </div>
    </ConsumerOriginContext.Provider>
  );
}
