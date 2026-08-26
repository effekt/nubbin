import type { Overrides, PuckApi } from "@measured/puck";
import type { SlotConstraint } from "@nubbin/core";
import type { PaletteGroup, PublishOutcome, StudioOperations } from "@nubbin/studio";
import type { ReactNode, RefObject } from "react";

/** Values supplied to a host's editor chrome without exposing Studio's internal state machine. */
export interface StudioEditorChromeContext {
  readonly apiRef: RefObject<(() => PuckApi) | undefined>;
  readonly route: string;
  readonly routes: readonly string[];
  readonly operations: StudioOperations;
  readonly onOutcome: (outcome: PublishOutcome) => void;
  readonly palette: readonly PaletteGroup[];
  readonly docsByBlock: Record<string, Record<string, string>>;
  readonly slotsByBlock: Record<string, Record<string, SlotConstraint>>;
}

/** Replaceable presentation around the reusable editor engine. */
export interface StudioEditorPresentation {
  readonly overrides: (context: StudioEditorChromeContext) => Partial<Overrides>;
  readonly outcome?: (outcome: PublishOutcome, dismiss: () => void) => ReactNode;
  readonly status?: () => ReactNode;
}
