"use client";

import { type Config, type Data, Puck, type PuckApi } from "@measured/puck";
import type { PublishOutcome } from "@nubbin/studio";
import { foldPuckChange, patchEditorStatus, toAuthorIssues, toPuckData } from "@nubbin/studio";
import { useCallback, useRef, useState } from "react";
import { ConsumerOriginContext } from "./ConsumerOriginContext";
import { DraftConflictPanel } from "./DraftConflictPanel";
import type { StudioEditorPresentation } from "./studioEditorPresentation.types";
import type { StudioEditorProps } from "./studioEditorProps.types";
import { useDraftSave } from "./useDraftSave";
import { useResetEditorStatus } from "./useResetEditorStatus";
import { useStudioEditorProjections } from "./useStudioEditorProjections";
import { useStudioOverrides } from "./useStudioOverrides";

export interface AssembledStudioEditorProps extends StudioEditorProps {
  readonly puckConfig: Config;
  readonly presentation: StudioEditorPresentation;
}

/** Owns Puck's controlled state and the complete draft-to-publish editor lifecycle. */
export function StudioEditor({
  config: studioConfig,
  route,
  routes,
  initialData,
  initialVersion,
  initialRevision,
  consumerOrigin,
  saveDraft,
  operations,
  puckConfig,
  presentation,
}: AssembledStudioEditorProps) {
  const { catalog } = studioConfig;
  const { palette, docsByBlock, blockSlots, slotsByBlock } =
    useStudioEditorProjections(studioConfig);
  const prior = useRef(initialVersion);
  const puckApi = useRef<(() => PuckApi) | undefined>(undefined);
  const [data, setData] = useState<Data>(initialData);
  const [outcome, setOutcome] = useState<PublishOutcome | undefined>(undefined);
  useResetEditorStatus();
  const onReconciled = useCallback((version: typeof initialVersion) => {
    prior.current = version;
    setData(toPuckData(version));
    setOutcome(undefined);
    patchEditorStatus({ published: false, savedAt: undefined });
  }, []);
  const draft = useDraftSave(route, initialVersion, initialRevision, saveDraft, onReconciled);
  const onChange = (next: Data) => {
    const folded = foldPuckChange(next, prior.current, blockSlots);
    prior.current = folded.version;
    setData(folded.data);
    setOutcome(undefined);
    patchEditorStatus({ published: false, savedAt: undefined });
    draft.save(folded.version);
  };
  const dismissOutcome = useCallback(() => setOutcome(undefined), []);
  const onOutcome = useCallback(
    (next: PublishOutcome) => {
      setOutcome(next);
      if (!next.ok) {
        patchEditorStatus({
          issues: toAuthorIssues(next.issues, catalog, prior.current),
          issuesOpen: true,
        });
      }
    },
    [catalog],
  );
  const overrides = useStudioOverrides(presentation, {
    apiRef: puckApi,
    route,
    routes,
    viewports: studioConfig.viewports,
    operations,
    onOutcome,
    palette,
    docsByBlock,
    slotsByBlock,
  });
  return (
    <ConsumerOriginContext.Provider value={consumerOrigin}>
      <div className="nubbin-studio nb-studio-frame">
        <div className="nubbin-notices">
          {outcome === undefined ? null : presentation.outcome?.(outcome, dismissOutcome)}
        </div>
        <Puck
          config={puckConfig}
          data={data}
          onChange={onChange}
          overrides={overrides}
          viewports={studioConfig.viewports}
        />
        <DraftConflictPanel conflicts={draft.conflicts} onResolve={draft.resolve} />
        {presentation.status?.()}
      </div>
    </ConsumerOriginContext.Provider>
  );
}
