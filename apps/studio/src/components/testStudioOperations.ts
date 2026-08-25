import type { StudioOperations } from "@nubbin/studio";
import { getHistory } from "../nubbin/getHistory";
import { postPublish } from "../nubbin/postPublish";
import { postRollback } from "../nubbin/postRollback";

/** The app's HTTP operations reused by component tests that stub fetch at the wire. */
export const testStudioOperations: StudioOperations = {
  publish: postPublish,
  history: getHistory,
  rollback: postRollback,
};
