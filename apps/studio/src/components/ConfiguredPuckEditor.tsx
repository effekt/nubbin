"use client";

import { createStudioHttpClient, toAuthorIssues } from "@nubbin/studio";
import studioConfig from "@nubbin/studio-config";
import type { ComponentProps } from "react";
import { PuckEditor } from "./PuckEditor";

const client = createStudioHttpClient();

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
      operations={client}
      saveDraft={async (route, version) => {
        const raw = await client.saveDraft(route, version);
        return raw === undefined ? undefined : toAuthorIssues(raw, studioConfig.catalog, version);
      }}
    />
  );
}
