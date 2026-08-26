import {
  toDocsByBlock,
  toPaletteGroups,
  toSlotConstraintsByBlock,
  toSlotNamesByBlock,
} from "@nubbin/studio";
import { useMemo } from "react";
import type { StudioEditorConfig } from "./studioConfig.types";

/** Derives the immutable editor projections shared by Puck state and host chrome. */
export function useStudioEditorProjections({ catalog, registry }: StudioEditorConfig) {
  const palette = useMemo(() => toPaletteGroups(catalog, registry), [catalog, registry]);
  const docsByBlock = useMemo(() => toDocsByBlock(catalog, registry), [catalog, registry]);
  const blockSlots = useMemo(() => toSlotNamesByBlock(registry), [registry]);
  const slotsByBlock = useMemo(() => toSlotConstraintsByBlock(registry), [registry]);
  return { palette, docsByBlock, blockSlots, slotsByBlock };
}
