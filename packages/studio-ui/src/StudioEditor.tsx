"use client";

import { type Config, type Data, Puck, type PuckApi } from "@measured/puck";
import type { PublishOutcome } from "@nubbin/studio";
import {
  editorStatusStore,
  foldPuckChange,
  patchEditorStatus,
  toAuthorIssues,
} from "@nubbin/studio";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConsumerOriginContext } from "./ConsumerOriginContext";
import type { StudioEditorPresentation } from "./studioEditorPresentation.types";
import type { StudioEditorProps } from "./studioEditorProps.types";
import { useDraftSave } from "./useDraftSave";
import { useStudioEditorProjections } from "./useStudioEditorProjections";

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
  useEffect(() => {
    editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
  }, []);
  const save = useDraftSave(route, saveDraft);
  const onChange = (next: Data) => {
    const folded = foldPuckChange(next, prior.current, blockSlots);
    prior.current = folded.version;
    setData(folded.data);
    setOutcome(undefined);
    patchEditorStatus({ published: false, savedAt: undefined });
    save(folded.version);
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
  const overrides = useMemo(
    () =>
      presentation.overrides({
        apiRef: puckApi,
        route,
        routes,
        operations,
        onOutcome,
        palette,
        docsByBlock,
        slotsByBlock,
      }),
    [presentation, route, routes, operations, onOutcome, palette, docsByBlock, slotsByBlock],
  );
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
        {presentation.status?.()}
      </div>
    </ConsumerOriginContext.Provider>
  );
}
