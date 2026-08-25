"use client";

import studioConfig from "@nubbin/studio-config";
import type { ComponentProps } from "react";
import { getHistory } from "../nubbin/getHistory";
import { postDraftSave } from "../nubbin/postDraftSave";
import { postPublish } from "../nubbin/postPublish";
import { postRollback } from "../nubbin/postRollback";
import { toAuthorIssues } from "../nubbin/toAuthorIssues";
import { PuckEditor } from "./PuckEditor";

type ConfiguredPuckEditorProps = Omit<
  ComponentProps<typeof PuckEditor>,
  "config" | "operations" | "saveDraft"
>;

/** Binds the reusable editor surface to this Studio deployment's consumer-owned config. */
export function ConfiguredPuckEditor(props: ConfiguredPuckEditorProps) {
  return (
    <PuckEditor
      {...props}
      config={studioConfig}
      operations={{ publish: postPublish, history: getHistory, rollback: postRollback }}
      saveDraft={async (route, version) => {
        const raw = await postDraftSave(route, version);
        return raw === undefined ? undefined : toAuthorIssues(raw, studioConfig.catalog, version);
      }}
    />
  );
}
