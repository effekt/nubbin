"use client";

import { patchEditorStatus } from "@nubbin/studio";
import { type ReactNode, useEffect } from "react";

/**
 * The `iframe` override's only job beyond passing the preview through: Puck hands it the
 * frame's document once the frame has actually mounted one, and that hand-over is the
 * proof the status bar's "Preview connected" rests on — never a claim made in advance.
 */
export function FrameLoadedProbe({
  document,
  children,
}: {
  document?: Document | undefined;
  children: ReactNode;
}) {
  useEffect(() => {
    if (document !== undefined) {
      patchEditorStatus({ frameLoaded: true });
    }
  }, [document]);
  return <>{children}</>;
}
