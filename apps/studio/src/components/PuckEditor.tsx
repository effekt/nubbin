"use client";

import { type Data, Puck, type PuckApi } from "@measured/puck";
import "@measured/puck/puck.css";
import type { DocumentVersion } from "@nubbin/core";
import { catalog } from "demo/src/nubbin/catalog";
import { registry } from "demo/src/nubbin/registry";
import { useCallback, useMemo, useRef, useState } from "react";
import type { AuthorIssue } from "../nubbin/authorIssue.types";
import { foldPuckChange } from "../nubbin/foldPuckChange";
import { postDraftSave } from "../nubbin/postDraftSave";
import { postPublish } from "../nubbin/postPublish";
import type { PublishOutcome } from "../nubbin/publishOutcome.types";
import type { PuckData } from "../nubbin/puckData.types";
import { toAuthorIssues } from "../nubbin/toAuthorIssues";
import { toPuckConfig } from "../nubbin/toPuckConfig";
import { toSlotNamesByBlock } from "../nubbin/toSlotNamesByBlock";
import { IssuesPanel } from "./IssuesPanel";
import { PublishNotice } from "./PublishNotice";
import { selectPuckNode } from "./selectPuckNode";
import { toBridgedOverrides } from "./toBridgedOverrides";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SAVE_DELAY_MS = 500;

interface PuckEditorProps {
  route: string;
  initialData: PuckData;
  initialVersion: DocumentVersion;
}

/** The editor: stock Puck, controlled, with everything Nubbin-specific arriving through the
 * config derived from the demo's catalog and registry. Each change folds back into a Nubbin
 * draft and posts debounced to the draft endpoint. A refusal — the save's or the publish's —
 * shows above the canvas in author words, one clickable line per issue, and clicking one
 * selects the failing block; a publish that lands confirms with the route and links the
 * live page at the URL the endpoint built. */
export function PuckEditor({ route, initialData, initialVersion }: PuckEditorProps) {
  const config = useMemo(() => toPuckConfig(catalog, registry), []);
  const blockSlots = useMemo(() => toSlotNamesByBlock(registry), []);
  const prior = useRef(initialVersion);
  const puckApi = useRef<(() => PuckApi) | undefined>(undefined);
  const [data, setData] = useState(initialData);
  const [saveIssues, setSaveIssues] = useState<readonly AuthorIssue[] | undefined>(undefined);
  const [outcome, setOutcome] = useState<PublishOutcome | undefined>(undefined);
  const save = useDebouncedCallback((version: DocumentVersion) => {
    void postDraftSave(route, version).then((raw) =>
      setSaveIssues(raw === undefined ? undefined : toAuthorIssues(raw, catalog, version)),
    );
  }, SAVE_DELAY_MS);
  const onChange = (next: Data) => {
    const folded = foldPuckChange(next, prior.current, blockSlots);
    prior.current = folded.version;
    setData(folded.data);
    setOutcome(undefined);
    save(folded.version);
  };
  const onPublish = useCallback(() => {
    void postPublish(route).then(setOutcome);
  }, [route]);
  const overrides = useMemo(() => toBridgedOverrides(puckApi, onPublish), [onPublish]);
  const onSelect = (nodeId: string) => {
    const api = puckApi.current;
    if (api !== undefined) {
      selectPuckNode(api(), nodeId);
    }
  };
  const refused = outcome !== undefined && !outcome.ok;
  const issues = refused ? toAuthorIssues(outcome.issues, catalog, prior.current) : saveIssues;
  return (
    <>
      {issues !== undefined && issues.length > 0 ? (
        <IssuesPanel
          heading={refused ? "Publishing was refused" : "This draft has issues"}
          issues={issues}
          onSelect={onSelect}
        />
      ) : null}
      {outcome?.ok === true ? (
        <PublishNotice route={route} hash={outcome.hash} url={outcome.url} />
      ) : null}
      <Puck config={config} data={data} onChange={onChange} overrides={overrides} />
    </>
  );
}
