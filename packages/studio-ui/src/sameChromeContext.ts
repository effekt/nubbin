import type { StudioEditorChromeContext } from "./studioEditorPresentation.types";

export function sameChromeContext(
  left: StudioEditorChromeContext,
  right: StudioEditorChromeContext,
): boolean {
  return (Object.keys(left) as (keyof StudioEditorChromeContext)[]).every(
    (key) => left[key] === right[key],
  );
}
