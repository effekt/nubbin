"use client";

import { type Data, Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import type { DocumentVersion } from "@nubbin/core";
import { catalog } from "demo/src/nubbin/catalog";
import { registry } from "demo/src/nubbin/registry";
import { useMemo, useRef, useState } from "react";
import { foldPuckChange } from "../nubbin/foldPuckChange";
import { postDraftSave } from "../nubbin/postDraftSave";
import { postPublish } from "../nubbin/postPublish";
import type { PuckData } from "../nubbin/puckData.types";
import { toPuckConfig } from "../nubbin/toPuckConfig";
import { toSlotNamesByBlock } from "../nubbin/toSlotNamesByBlock";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SAVE_DELAY_MS = 500;

interface PuckEditorProps {
  route: string;
  initialData: PuckData;
  initialVersion: DocumentVersion;
}

/** The editor: stock Puck, controlled, with everything Nubbin-specific arriving through the
 * config derived from the demo's catalog and registry. Each change folds back into a Nubbin
 * draft and posts debounced to the draft endpoint — a compile refusal means the draft saved
 * and the issues are the payload, listed plainly above the canvas. Publish posts to the same
 * endpoint the preview's form uses, and its answer shows just as plainly. */
export function PuckEditor({ route, initialData, initialVersion }: PuckEditorProps) {
  const config = useMemo(() => toPuckConfig(catalog, registry), []);
  const blockSlots = useMemo(() => toSlotNamesByBlock(registry), []);
  const prior = useRef(initialVersion);
  const [data, setData] = useState(initialData);
  const [issues, setIssues] = useState<readonly string[] | undefined>(undefined);
  const [publishOutcome, setPublishOutcome] = useState<string | undefined>(undefined);
  const save = useDebouncedCallback((version: DocumentVersion) => {
    void postDraftSave(route, version).then(setIssues);
  }, SAVE_DELAY_MS);
  const onChange = (next: Data) => {
    const folded = foldPuckChange(next, prior.current, blockSlots);
    prior.current = folded.version;
    setData(folded.data);
    save(folded.version);
  };
  const onPublish = async () => {
    setPublishOutcome(await postPublish(route));
  };
  return (
    <>
      {issues !== undefined && issues.length > 0 ? (
        <section aria-labelledby="draft-issues-heading" className="bg-canvas px-4 py-2">
          <h2 id="draft-issues-heading" className="sr-only">
            Compile issues
          </h2>
          <ul className="list-disc pl-5 text-sm">
            {issues.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {publishOutcome === undefined ? null : (
        <p className="bg-canvas px-4 py-2 text-sm" role="status">
          {publishOutcome}
        </p>
      )}
      <Puck config={config} data={data} onChange={onChange} onPublish={onPublish} />
    </>
  );
}
