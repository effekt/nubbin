import type { DraftSave, DraftSaveOutcome } from "./draftSave.types";
import type { RouteCreateOutcome } from "./routeCreateOutcome.types";
import type { StudioOperations } from "./studioOperations.types";

/** The browser-side services backed by a Nubbin Studio HTTP deployment. */
export interface StudioHttpClient extends StudioOperations {
  createRoute(route: string): Promise<RouteCreateOutcome>;
  saveDraft(save: DraftSave): Promise<DraftSaveOutcome>;
}
