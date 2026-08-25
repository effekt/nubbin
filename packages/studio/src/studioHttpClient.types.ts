import type { DocumentVersion } from "@nubbin/core";
import type { RouteCreateOutcome } from "./routeCreateOutcome.types";
import type { StudioOperations } from "./studioOperations.types";

/** The browser-side services backed by a Nubbin Studio HTTP deployment. */
export interface StudioHttpClient extends StudioOperations {
  createRoute(route: string): Promise<RouteCreateOutcome>;
  saveDraft(route: string, version: DocumentVersion): Promise<readonly unknown[] | undefined>;
}
