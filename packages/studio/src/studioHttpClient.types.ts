import type { DocumentVersion } from "@nubbin/core";
import type { StudioOperations } from "./studioOperations.types";

/** The browser-side services backed by a Nubbin Studio HTTP deployment. */
export interface StudioHttpClient extends StudioOperations {
  saveDraft(route: string, version: DocumentVersion): Promise<readonly unknown[] | undefined>;
}
