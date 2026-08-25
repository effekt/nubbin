"use client";

import studioConfig from "@nubbin/studio-config";
import type { ComponentProps } from "react";
import { postDraftSave } from "../nubbin/postDraftSave";
import { toAuthorIssues } from "../nubbin/toAuthorIssues";
import { PuckEditor } from "./PuckEditor";

type ConfiguredPuckEditorProps = Omit<ComponentProps<typeof PuckEditor>, "config" | "saveDraft">;

/** Binds the reusable editor surface to this Studio deployment's consumer-owned config. */
export function ConfiguredPuckEditor(props: ConfiguredPuckEditorProps) {
  return (
    <PuckEditor
      {...props}
      config={studioConfig}
      saveDraft={async (route, version) => {
        const raw = await postDraftSave(route, version);
        return raw === undefined ? undefined : toAuthorIssues(raw, studioConfig.catalog, version);
      }}
    />
  );
}
