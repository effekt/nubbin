import { createStudioHttpClient, type StudioOperations } from "@nubbin/studio";

/** HTTP operations for UI tests that stub fetch at the transport boundary. */
export const testStudioOperations: StudioOperations = createStudioHttpClient();
