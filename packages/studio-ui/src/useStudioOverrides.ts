"use client";

import type { Overrides } from "@measured/puck";
import { useRef } from "react";
import { sameChromeContext } from "./sameChromeContext";
import type {
  StudioEditorChromeContext,
  StudioEditorPresentation,
} from "./studioEditorPresentation.types";

export function useStudioOverrides(
  presentation: StudioEditorPresentation,
  context: StudioEditorChromeContext,
) {
  const cached = useRef<{
    presentation: StudioEditorPresentation;
    context: StudioEditorChromeContext;
    overrides: Partial<Overrides>;
  }>(undefined);
  if (
    cached.current === undefined ||
    cached.current.presentation !== presentation ||
    !sameChromeContext(cached.current.context, context)
  ) {
    cached.current = { presentation, context, overrides: presentation.overrides(context) };
  }
  return cached.current.overrides;
}
