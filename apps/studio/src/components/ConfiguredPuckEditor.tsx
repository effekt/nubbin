"use client";

import studioConfig from "@nubbin/studio-config";
import type { ComponentProps } from "react";
import { PuckEditor } from "./PuckEditor";

type ConfiguredPuckEditorProps = Omit<ComponentProps<typeof PuckEditor>, "config">;

/** Binds the reusable editor surface to this Studio deployment's consumer-owned config. */
export function ConfiguredPuckEditor(props: ConfiguredPuckEditorProps) {
  return <PuckEditor {...props} config={studioConfig} />;
}
