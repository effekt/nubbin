"use client";

import { type Data, Puck, type PuckApi } from "@measured/puck";
import "@measured/puck/puck.css";
import "./puckTheme.css";
import type { DocumentVersion } from "@nubbin/core";
import { catalog } from "demo/src/nubbin/catalog";
import { registry } from "demo/src/nubbin/registry";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONSUMER_VIEWPORTS } from "../nubbin/consumerViewports.constants";
import { foldPuckChange } from "../nubbin/foldPuckChange";
import { postDraftSave } from "../nubbin/postDraftSave";
import type { PublishOutcome } from "../nubbin/publishOutcome.types";
import type { PuckData } from "../nubbin/puckData.types";
import { toAuthorIssues } from "../nubbin/toAuthorIssues";
import { toPaletteGroups } from "../nubbin/toPaletteGroups";
import { toPuckConfig } from "../nubbin/toPuckConfig";
import { toSlotNamesByBlock } from "../nubbin/toSlotNamesByBlock";
import { editorStatusStore } from "./editorStatusStore";
import { PublishNotice } from "./PublishNotice";
import { patchEditorStatus } from "./patchEditorStatus";
import { toBridgedOverrides } from "./toBridgedOverrides";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SAVE_DELAY_MS = 500;

interface PuckEditorProps {
  route: string;
  routes: readonly string[];
  initialData: PuckData;
  initialVersion: DocumentVersion;
}

/** The editor: stock Puck, controlled, with everything Nubbin-specific arriving through the
 * config derived from the demo's catalog and registry. Each change folds back into a Nubbin
 * draft and posts debounced to the draft endpoint. A refusal — the save's or the publish's —
 * lands in the editor status store in author words, where the header's pill counts it and
 * its dropdown lists it; a publish refusal opens that dropdown itself. A publish that lands
 * reports inside the header's own panel — steps, timings and the live link — and a rollback
 * that lands confirms above the canvas with the route and the URL the endpoint built. */
export function PuckEditor({ route, routes, initialData, initialVersion }: PuckEditorProps) {
  const config = useMemo(() => toPuckConfig(catalog, registry), []);
  const palette = useMemo(() => toPaletteGroups(catalog, registry), []);
  const blockSlots = useMemo(() => toSlotNamesByBlock(registry), []);
  const prior = useRef(initialVersion);
  const puckApi = useRef<(() => PuckApi) | undefined>(undefined);
  const [data, setData] = useState(initialData);
  const [outcome, setOutcome] = useState<PublishOutcome | undefined>(undefined);
  useEffect(() => {
    // A client-side route switch keeps the module alive, so the previous draft's status
    // must not carry over. First load assumes changes: the store starts unpublished.
    editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
  }, []);
  const save = useDebouncedCallback((version: DocumentVersion) => {
    void postDraftSave(route, version).then((raw) =>
      patchEditorStatus({ issues: raw === undefined ? [] : toAuthorIssues(raw, catalog, version) }),
    );
  }, SAVE_DELAY_MS);
  const onChange = (next: Data) => {
    const folded = foldPuckChange(next, prior.current, blockSlots);
    prior.current = folded.version;
    setData(folded.data);
    setOutcome(undefined);
    patchEditorStatus({ published: false });
    save(folded.version);
  };
  const dismissOutcome = useCallback(() => setOutcome(undefined), []);
  const onOutcome = useCallback((next: PublishOutcome) => {
    setOutcome(next);
    if (!next.ok) {
      patchEditorStatus({
        issues: toAuthorIssues(next.issues, catalog, prior.current),
        issuesOpen: true,
      });
    }
  }, []);
  const overrides = useMemo(
    () => toBridgedOverrides(puckApi, { route, routes }, onOutcome, palette),
    [route, routes, onOutcome, palette],
  );
  return (
    <div className="nubbin-studio">
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
        viewports={CONSUMER_VIEWPORTS}
      />
    </div>
  );
}
