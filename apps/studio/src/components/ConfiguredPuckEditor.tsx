"use client";

import { toAuthorIssues } from "@nubbin/studio";
import studioConfig from "@nubbin/studio-config";
import type { ComponentProps } from "react";
import { studioHttpClient } from "../nubbin/studioHttpClient";
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
      operations={studioHttpClient}
      saveDraft={async (route, version) => {
        const raw = await studioHttpClient.saveDraft(route, version);
        return raw === undefined ? undefined : toAuthorIssues(raw, studioConfig.catalog, version);
      }}
    />
  );
}
