import { createStudioHttpClient } from "@nubbin/studio";

/** This deployment's network binding. A standalone host can supply a base URL or wrapped fetch. */
export const studioHttpClient = createStudioHttpClient();
