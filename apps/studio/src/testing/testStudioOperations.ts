import { createStudioHttpClient, type StudioOperations } from "@nubbin/studio";

/** The app's HTTP operations reused by component tests that stub fetch at the wire. */
export const testStudioOperations: StudioOperations = createStudioHttpClient();
