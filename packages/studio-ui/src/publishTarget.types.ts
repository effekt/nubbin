import type { PublishOutcome, StudioOperations } from "@nubbin/studio";

export interface PublishTarget {
  route: string;
  operations: StudioOperations;
  onOutcome: (outcome: PublishOutcome) => void;
}
